-- Log penjanaan soalan gaya SPM (function jana-spm) — dikira dalam had penjanaan sejam.
ALTER TABLE public.soalan_dijana_log DROP CONSTRAINT IF EXISTS soalan_dijana_log_jenis_check;
ALTER TABLE public.soalan_dijana_log
  ADD CONSTRAINT soalan_dijana_log_jenis_check CHECK (jenis IN ('soalan', 'rpt', 'spm'));
