-- =============================================================================
-- Soalan Percubaan / Ramalan SPM (himpunan panitia). Teks kekal dalam RUMI seperti sumber asal.
-- Diisi oleh `npm run percubaan` (scripts/import-percubaan.mjs -> supabase/seed_percubaan.sql).
-- =============================================================================
CREATE TABLE public.soalan_percubaan (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nombor baris dalam himpunan sumber (lajur SOALAN) — kunci untuk import semula.
  no_asal       SMALLINT     NOT NULL UNIQUE,
  bidang        VARCHAR(20)  NOT NULL CHECK (bidang IN ('Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak')),
  bahagian      VARCHAR(40)  NOT NULL,          -- cth. 'Soalan 4 (a)'
  no_soalan     SMALLINT,
  soalan        TEXT         NOT NULL,
  markah        SMALLINT     CHECK (markah BETWEEN 0 AND 50),
  skema_jawapan TEXT         NOT NULL,
  sumber        TEXT[]       NOT NULL DEFAULT '{}',  -- kod negeri/sumber: SBP, JHR, KEL, ...
  tag           VARCHAR(60),                          -- cth. 'SPM 2024', 'Percubaan 2026'
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.soalan_percubaan IS 'Himpunan soalan percubaan negeri / ramalan SPM Pendidikan Islam (Rumi)';

-- Akses hanya melalui function `data` (service role), sama seperti jadual lain.
ALTER TABLE public.soalan_percubaan ENABLE ROW LEVEL SECURITY;
