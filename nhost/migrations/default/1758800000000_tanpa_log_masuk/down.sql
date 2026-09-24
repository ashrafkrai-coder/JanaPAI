-- Gagal jika sudah ada baris tanpa pemilik; padam atau tetapkan user_id baris itu dahulu.
DROP INDEX IF EXISTS public.soalan_dijana_log_created_idx;
ALTER TABLE public.soalan_dijana_log ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.koleksi_soalan    ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.rpt               ALTER COLUMN user_id SET NOT NULL;
