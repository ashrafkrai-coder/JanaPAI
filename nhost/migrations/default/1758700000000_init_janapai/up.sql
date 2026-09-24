-- =============================================================================
-- JanaPAI — Skema pangkalan data (Nhost / PostgreSQL)
-- Penjana Soalan Pendidikan Islam KSSM Tingkatan 1-5 & Penjana RPT
--
-- Jalankan melalui Nhost CLI (`nhost up` akan apply migration ini), atau
-- tampal ke Hasura Console > Data > SQL (tandakan "This is a migration").
-- =============================================================================

-- gen_random_uuid() — sudah tersedia di Nhost, tetapi selamat untuk dipastikan.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- Fungsi trigger umum: kemas kini updated_at secara automatik
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- 1. dskp — Silibus Pendidikan Islam KSSM Tingkatan 1-5
-- =============================================================================
CREATE TABLE public.dskp (
  id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  tingkatan              SMALLINT     NOT NULL CHECK (tingkatan BETWEEN 1 AND 5),
  bidang                 VARCHAR(20)  NOT NULL CHECK (bidang IN ('Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak')),
  -- Susunan tajuk bagi tingkatan ini merentas semua bidang (ikut urutan unit buku teks/DSKP).
  -- Digunakan untuk menyusun RPT mengikut urutan silibus.
  urutan                 SMALLINT     NOT NULL DEFAULT 1,
  tajuk                  VARCHAR(255) NOT NULL,
  standard_kandungan     TEXT         NOT NULL,
  standard_pembelajaran  TEXT         NOT NULL,
  objektif_pembelajaran  TEXT,
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT dskp_tingkatan_bidang_tajuk_key UNIQUE (tingkatan, bidang, tajuk)
);

COMMENT ON TABLE public.dskp IS 'Dokumen Standard Kurikulum dan Pentaksiran — Pendidikan Islam KSSM Tingkatan 1-5';

-- Carian utama: "semua tajuk Tingkatan X (bidang Y) mengikut urutan"
CREATE INDEX dskp_tingkatan_urutan_idx ON public.dskp (tingkatan, urutan);
CREATE INDEX dskp_tingkatan_bidang_idx ON public.dskp (tingkatan, bidang);

CREATE TRIGGER dskp_set_updated_at
  BEFORE UPDATE ON public.dskp
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- 2. takwim_persekolahan — Takwim tahunan sekolah
-- =============================================================================
CREATE TABLE public.takwim_persekolahan (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun        SMALLINT    NOT NULL CHECK (tahun BETWEEN 2020 AND 2100),
  -- Kumpulan A (Johor, Kedah, Kelantan, Terengganu — hujung minggu Jumaat/Sabtu)
  -- Kumpulan B (negeri lain — hujung minggu Sabtu/Ahad). Tarikh minggu berbeza.
  kumpulan     CHAR(1)     NOT NULL DEFAULT 'B' CHECK (kumpulan IN ('A', 'B')),
  minggu_ke    SMALLINT    NOT NULL CHECK (minggu_ke BETWEEN 1 AND 53),
  tarikh_mula  DATE        NOT NULL,
  tarikh_tamat DATE        NOT NULL,
  -- TRUE = minggu PdP biasa; FALSE = cuti / peperiksaan / program penuh (tiada PdP).
  -- Diasingkan daripada `catatan` supaya penjana RPT tidak perlu meneka dari teks bebas.
  minggu_pdp   BOOLEAN     NOT NULL DEFAULT TRUE,
  catatan      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT takwim_tarikh_sah CHECK (tarikh_tamat >= tarikh_mula),
  CONSTRAINT takwim_tahun_kumpulan_minggu_key UNIQUE (tahun, kumpulan, minggu_ke)
);

COMMENT ON TABLE public.takwim_persekolahan IS 'Takwim persekolahan mingguan (KPM) mengikut tahun dan kumpulan negeri';
-- Index untuk UNIQUE (tahun, kumpulan, minggu_ke) sudah mencukupi untuk carian takwim setahun.

-- =============================================================================
-- 3. rpt — Rancangan Pengajaran Tahunan yang dijana
-- =============================================================================
CREATE TABLE public.rpt (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Pemilik RPT (guru). Diisi automatik oleh Hasura (column preset X-Hasura-User-Id).
  user_id          UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  tahun            SMALLINT    NOT NULL CHECK (tahun BETWEEN 2020 AND 2100),
  tingkatan        SMALLINT    NOT NULL CHECK (tingkatan BETWEEN 1 AND 5),
  minggu_ke        SMALLINT    NOT NULL CHECK (minggu_ke BETWEEN 1 AND 53),
  tarikh_mula      DATE        NOT NULL,
  tarikh_tamat     DATE        NOT NULL,
  -- NULL dibenarkan untuk minggu cuti / peperiksaan / ulang kaji.
  tajuk_id         UUID        REFERENCES public.dskp (id) ON DELETE SET NULL,
  catatan_aktiviti TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rpt_tarikh_sah CHECK (tarikh_tamat >= tarikh_mula)
);

COMMENT ON TABLE public.rpt IS 'Rancangan Pengajaran Tahunan — satu baris bagi setiap (minggu, tajuk)';

CREATE INDEX rpt_user_tahun_tingkatan_minggu_idx ON public.rpt (user_id, tahun, tingkatan, minggu_ke);
CREATE INDEX rpt_tajuk_id_idx ON public.rpt (tajuk_id);  -- FK tidak diindeks secara automatik di PostgreSQL

-- =============================================================================
-- 4. koleksi_soalan — Bank soalan yang disimpan
-- =============================================================================
CREATE TABLE public.koleksi_soalan (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- Rujukan pilihan ke tajuk DSKP (tajuk disimpan juga sebagai teks supaya soalan
  -- kekal bermakna walaupun baris DSKP diubah/dipadam).
  dskp_id         UUID         REFERENCES public.dskp (id) ON DELETE SET NULL,
  tingkatan       SMALLINT     NOT NULL CHECK (tingkatan BETWEEN 1 AND 5),
  bidang          VARCHAR(20)  NOT NULL CHECK (bidang IN ('Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak')),
  tajuk           VARCHAR(255) NOT NULL,
  aras_kognitif   VARCHAR(10)  NOT NULL CHECK (aras_kognitif IN ('Rendah', 'Sederhana', 'Tinggi', 'KBAT')),
  jenis_soalan    VARCHAR(10)  NOT NULL CHECK (jenis_soalan IN ('Objektif', 'Subjektif')),
  soalan          TEXT         NOT NULL,
  -- Objektif: {"A": "...", "B": "...", "C": "...", "D": "..."}; Subjektif: NULL
  pilihan_jawapan JSONB,
  skema_jawapan   TEXT         NOT NULL,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT koleksi_soalan_pilihan_sah CHECK (
    (jenis_soalan = 'Objektif'  AND jsonb_typeof(pilihan_jawapan) = 'object'
                                AND pilihan_jawapan ?& ARRAY['A', 'B', 'C', 'D'])
    OR
    (jenis_soalan = 'Subjektif' AND pilihan_jawapan IS NULL)
  )
);

COMMENT ON TABLE public.koleksi_soalan IS 'Bank soalan Pendidikan Islam yang disimpan oleh guru';

CREATE INDEX koleksi_soalan_user_created_idx  ON public.koleksi_soalan (user_id, created_at DESC);
CREATE INDEX koleksi_soalan_filter_idx        ON public.koleksi_soalan (tingkatan, bidang, aras_kognitif, jenis_soalan);
CREATE INDEX koleksi_soalan_dskp_id_idx       ON public.koleksi_soalan (dskp_id);

-- =============================================================================
-- 5. soalan_dijana_log — Log sejarah penjanaan oleh pengguna
-- =============================================================================
CREATE TABLE public.soalan_dijana_log (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- 'soalan' atau 'rpt' — supaya satu log boleh merekod kedua-dua jenis penjanaan.
  jenis             VARCHAR(10) NOT NULL DEFAULT 'soalan' CHECK (jenis IN ('soalan', 'rpt')),
  parameter_carian  JSONB       NOT NULL,
  hasil_soalan_json JSONB       NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.soalan_dijana_log IS 'Log setiap panggilan penjana AI (parameter + output mentah)';

CREATE INDEX soalan_dijana_log_user_created_idx ON public.soalan_dijana_log (user_id, created_at DESC);
