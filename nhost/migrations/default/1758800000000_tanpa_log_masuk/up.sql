-- JanaPAI tanpa log masuk: rekod tidak lagi dimiliki oleh pengguna tertentu.
-- user_id dikekalkan (boleh NULL) supaya log masuk boleh dipulihkan kelak tanpa kehilangan data.
ALTER TABLE public.rpt               ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.koleksi_soalan    ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.soalan_dijana_log ALTER COLUMN user_id DROP NOT NULL;

-- Had penjanaan kini dikira untuk semua pelawat (bukan per pengguna).
CREATE INDEX IF NOT EXISTS soalan_dijana_log_created_idx ON public.soalan_dijana_log (created_at DESC);
