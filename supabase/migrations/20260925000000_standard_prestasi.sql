-- Standard Prestasi (Tahap Penguasaan TP1-TP6) bagi setiap Standard Kandungan.
-- Bentuk: tatasusunan JSON 6 teks tafsiran, indeks 0 = TP1 … indeks 5 = TP6.
ALTER TABLE public.dskp ADD COLUMN IF NOT EXISTS standard_prestasi JSONB;

ALTER TABLE public.dskp DROP CONSTRAINT IF EXISTS dskp_standard_prestasi_sah;
ALTER TABLE public.dskp ADD CONSTRAINT dskp_standard_prestasi_sah CHECK (
  standard_prestasi IS NULL
  OR (jsonb_typeof(standard_prestasi) = 'array' AND jsonb_array_length(standard_prestasi) = 6)
);

COMMENT ON COLUMN public.dskp.standard_prestasi IS 'Tafsiran TP1-TP6 (tatasusunan 6 teks Jawi) daripada DSKP';
