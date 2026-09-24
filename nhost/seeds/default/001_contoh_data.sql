-- =============================================================================
-- DATA CONTOH SAHAJA — untuk menguji aplikasi.
--
-- * DSKP: beberapa baris contoh. GANTIKAN dengan kandungan DSKP Pendidikan Islam
--   KSSM rasmi (BPK/KPM) sebelum digunakan untuk PdP sebenar.
-- * Takwim: dijana secara automatik (mingguan) dari tarikh mula yang anda tetapkan.
--   Kemudian tandakan minggu cuti/peperiksaan mengikut takwim KPM tahun semasa.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- DSKP (contoh)
-- -----------------------------------------------------------------------------
INSERT INTO public.dskp (tingkatan, bidang, urutan, tajuk, standard_kandungan, standard_pembelajaran, objektif_pembelajaran) VALUES
(1, 'Al-Quran', 1, '[CONTOH] Tilawah Surah Al-Mulk ayat 1-11',
 'Membaca dan memahami Surah Al-Mulk ayat 1-11 dengan betul dan fasih.',
 E'1.1 Membaca ayat dengan bertajwid.\n1.2 Menjelaskan maksud ayat.\n1.3 Menghubungkaitkan pengajaran ayat dengan kehidupan.',
 'Murid dapat membaca ayat dengan betul dan menyatakan sekurang-kurangnya tiga pengajaran.'),
(1, 'Akidah', 2, '[CONTOH] Beriman kepada Allah SWT',
 'Memahami konsep beriman kepada Allah SWT dan menghayatinya.',
 E'1.1 Menyatakan maksud beriman kepada Allah SWT.\n1.2 Menjelaskan bukti kewujudan Allah SWT.\n1.3 Menilai kepentingan beriman kepada Allah SWT.',
 'Murid dapat menjelaskan maksud dan kepentingan beriman kepada Allah SWT.'),
(1, 'Fiqah', 3, '[CONTOH] Solat Jamak dan Qasar',
 'Memahami dan mengamalkan solat jamak dan qasar mengikut syarat yang ditetapkan.',
 E'1.1 Menyatakan maksud solat jamak dan qasar.\n1.2 Menjelaskan syarat-syarat solat jamak dan qasar.\n1.3 Menunjukkan cara melaksanakan solat jamak dan qasar.',
 'Murid dapat menjelaskan syarat dan melaksanakan solat jamak dan qasar dengan betul.'),
(1, 'Sirah', 4, '[CONTOH] Kelahiran Nabi Muhammad SAW',
 'Memahami peristiwa kelahiran Nabi Muhammad SAW dan mengambil iktibar.',
 E'1.1 Menceritakan peristiwa kelahiran Nabi Muhammad SAW.\n1.2 Menjelaskan keadaan masyarakat Arab jahiliah.\n1.3 Merumuskan iktibar daripada peristiwa tersebut.',
 'Murid dapat menceritakan peristiwa kelahiran Nabi SAW dan merumuskan iktibar.'),
(1, 'Akhlak', 5, '[CONTOH] Adab terhadap ibu bapa',
 'Memahami dan mengamalkan adab terhadap ibu bapa.',
 E'1.1 Menyatakan adab-adab terhadap ibu bapa.\n1.2 Menjelaskan kepentingan berbakti kepada ibu bapa.\n1.3 Mengamalkan adab terhadap ibu bapa dalam kehidupan.',
 'Murid dapat menyenaraikan adab terhadap ibu bapa dan mengamalkannya.'),
(1, 'Hadis', 6, '[CONTOH] Hadis tentang niat',
 'Memahami hadis tentang kepentingan niat dalam amalan.',
 E'1.1 Membaca hadis dengan betul.\n1.2 Menjelaskan maksud hadis.\n1.3 Menghuraikan pengajaran hadis.',
 'Murid dapat menjelaskan maksud dan pengajaran hadis tentang niat.')
ON CONFLICT (tingkatan, bidang, tajuk) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Takwim (dijana) — ubah 3 nilai di bawah mengikut takwim KPM rasmi
-- -----------------------------------------------------------------------------
INSERT INTO public.takwim_persekolahan (tahun, kumpulan, minggu_ke, tarikh_mula, tarikh_tamat, minggu_pdp, catatan)
SELECT
  2026                                            AS tahun,
  'B'                                             AS kumpulan,
  n                                               AS minggu_ke,
  DATE '2026-01-12' + (n - 1) * 7                 AS tarikh_mula,   -- <-- tarikh hari pertama sesi (Isnin)
  DATE '2026-01-12' + (n - 1) * 7 + 4             AS tarikh_tamat,  -- Isnin-Jumaat
  TRUE,
  'Minggu Persekolahan'
FROM generate_series(1, 42) AS n                                    -- <-- bilangan minggu dalam takwim
ON CONFLICT (tahun, kumpulan, minggu_ke) DO NOTHING;

-- Contoh menandakan minggu bukan PdP (sesuaikan nombor minggu dengan takwim sebenar):
-- UPDATE public.takwim_persekolahan SET minggu_pdp = FALSE, catatan = 'Cuti Penggal 1'
--   WHERE tahun = 2026 AND kumpulan = 'B' AND minggu_ke IN (10);
-- UPDATE public.takwim_persekolahan SET minggu_pdp = FALSE, catatan = 'Peperiksaan Pertengahan Tahun'
--   WHERE tahun = 2026 AND kumpulan = 'B' AND minggu_ke IN (20, 21);
