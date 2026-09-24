-- =============================================================================
-- JanaPAI — Skema pangkalan data (Supabase / PostgreSQL)
-- Penjana Soalan Pendidikan Islam KSSM Tingkatan 1-5 & Penjana RPT
--
-- Jalankan dengan `npx supabase db push`, atau tampal ke Supabase Dashboard > SQL Editor.
-- Tiada akaun pengguna: semua akses melalui Edge Functions (service role) selepas kata
-- laluan panitia disahkan. RLS diaktifkan TANPA polisi, jadi kunci anon tidak boleh
-- membaca atau menulis apa-apa secara terus.
-- =============================================================================

-- gen_random_uuid() — sudah tersedia di Supabase, tetapi selamat untuk dipastikan.
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

CREATE INDEX rpt_tahun_tingkatan_minggu_idx ON public.rpt (tahun, tingkatan, minggu_ke);
CREATE INDEX rpt_tajuk_id_idx ON public.rpt (tajuk_id);  -- FK tidak diindeks secara automatik di PostgreSQL

-- =============================================================================
-- 4. koleksi_soalan — Bank soalan yang disimpan
-- =============================================================================
CREATE TABLE public.koleksi_soalan (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
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

COMMENT ON TABLE public.koleksi_soalan IS 'Bank soalan Pendidikan Islam yang dikongsi oleh panitia';

CREATE INDEX koleksi_soalan_created_idx       ON public.koleksi_soalan (created_at DESC);
CREATE INDEX koleksi_soalan_filter_idx        ON public.koleksi_soalan (tingkatan, bidang, aras_kognitif, jenis_soalan);
CREATE INDEX koleksi_soalan_dskp_id_idx       ON public.koleksi_soalan (dskp_id);

-- =============================================================================
-- 5. soalan_dijana_log — Log sejarah penjanaan AI (juga untuk had penjanaan sejam)
-- =============================================================================
CREATE TABLE public.soalan_dijana_log (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 'soalan' atau 'rpt' — supaya satu log boleh merekod kedua-dua jenis penjanaan.
  jenis             VARCHAR(10) NOT NULL DEFAULT 'soalan' CHECK (jenis IN ('soalan', 'rpt')),
  parameter_carian  JSONB       NOT NULL,
  hasil_soalan_json JSONB       NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.soalan_dijana_log IS 'Log setiap panggilan penjana AI (parameter + output mentah)';

CREATE INDEX soalan_dijana_log_created_idx ON public.soalan_dijana_log (created_at DESC);

-- =============================================================================
-- 6. Keselamatan: RLS tanpa polisi = tiada akses untuk anon/authenticated.
--    Edge Functions menggunakan service role (memintas RLS) selepas token panitia disahkan.
-- =============================================================================
ALTER TABLE public.dskp                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takwim_persekolahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rpt                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koleksi_soalan      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soalan_dijana_log   ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 7. simpan_rpt — gantikan RPT (tahun, tingkatan) mulai minggu tertentu dalam SATU transaksi,
--    supaya RPT lama tidak hilang jika sisipan gagal. Hanya untuk service role (Edge Functions).
-- =============================================================================
CREATE OR REPLACE FUNCTION public.simpan_rpt(p_tahun SMALLINT, p_tingkatan SMALLINT, p_dari SMALLINT, p_baris JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  bil INTEGER;
BEGIN
  DELETE FROM public.rpt WHERE tahun = p_tahun AND tingkatan = p_tingkatan AND minggu_ke >= p_dari;

  INSERT INTO public.rpt (tahun, tingkatan, minggu_ke, tarikh_mula, tarikh_tamat, tajuk_id, catatan_aktiviti)
  SELECT p_tahun, p_tingkatan, b.minggu_ke, b.tarikh_mula, b.tarikh_tamat, b.tajuk_id, b.catatan_aktiviti
  FROM jsonb_to_recordset(p_baris) AS b(
    minggu_ke SMALLINT, tarikh_mula DATE, tarikh_tamat DATE, tajuk_id UUID, catatan_aktiviti TEXT
  );
  GET DIAGNOSTICS bil = ROW_COUNT;
  RETURN bil;
END;
$$;

REVOKE ALL ON FUNCTION public.simpan_rpt(SMALLINT, SMALLINT, SMALLINT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.simpan_rpt(SMALLINT, SMALLINT, SMALLINT, JSONB) TO service_role;
