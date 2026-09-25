-- Dijana oleh scripts/import-percubaan.mjs pada 2026-09-25 — JANGAN sunting dengan tangan.
-- Sumber: https://docs.google.com/spreadsheets/d/1D_EXLhtFEgcC7gB5xb6p40WZ7-kxOHkRo2aaPN3fBdM (78 soalan)
--         + supabase/percubaan/*.json (76 soalan; 9 soalan spreadsheet digantikan)
DELETE FROM public.soalan_percubaan
WHERE no_asal NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 80, 81, 82, 83, 84, 85, 86, 87, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020, 20021, 20022, 20023, 20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20038);

INSERT INTO public.soalan_percubaan (no_asal, bidang, bahagian, no_soalan, soalan, markah, skema_jawapan, sumber, tag) VALUES
(1, 'Akidah', 'Soalan 2', 1, 'Nyatakan maksud Akidah Ahli Sunnah Wal Jamaah (ASWJ)', 2, 'Golongan majoriti umat Islam yang berpegang teguh kepada al-Quran dan al-Sunnah mengikut pemahaman Rasulullah SAW, para sahabat, tabi''in dan ulama salaf. (Isi + huraian)', ARRAY['SBP']::text[], 'SPM 2024'),
(2, 'Akidah', 'Soalan 2', 2, 'Nyatakan EMPAT nama lain bagi Ahli Sunnah Wal Jamaah', 2, '1. Ahlul Athar / 2. Ahlul Hadis / 3. al-Firqah al-Najiyah / 4. al-Thaifah al-Mansurah', ARRAY['SBP']::text[], 'SPM 2024'),
(3, 'Akidah', 'Soalan 2', 3, 'Jelaskan DUA perbezaan pegangan ASWJ dengan aliran Muktazilah', 4, '1. ASWJ: Iman = kepercayaan hati + pengakuan lidah + amalan — Muktazilah: Iman hanya amalan lahir sahaja / 2. ASWJ: Perbuatan manusia dicipta Allah tetapi manusia diberi pilihan — Muktazilah: Manusia bertanggungjawab sepenuhnya', ARRAY['SBP']::text[], 'SPM 2024'),
(4, 'Akidah', 'Soalan 2', 4, 'Apakah maksud nama Allah al-Raqib? Berikan SATU bukti bahawa Allah bersifat al-Raqib', 4, 'Maksud: Allah Maha Mengawasi segala perbuatan makhluk-Nya. Bukti: Surah al-Nisa'' ayat 1 / Malaikat Raqib dan Atid mencatat amalan manusia', ARRAY['SBP']::text[], 'SPM 2023'),
(5, 'Akidah', 'Soalan 2', 5, 'Nyatakan DUA tindakan yang perlu dilakukan oleh seseorang yang beriman dengan nama Allah al-Syahid', 2, '1. Sentiasa berhati-hati dalam perkataan dan perbuatan kerana Allah menyaksikan segalanya / 2. Melaksanakan ibadat dengan ikhlas walaupun tiada orang melihat', ARRAY['SBP']::text[], 'SPM 2022'),
(6, 'Akidah', 'Soalan 2', 6, 'Jelaskan maksud Fiqh al-Aulawiyat dan nyatakan DUA prinsip asasnya', 4, 'Maksud: Ilmu mengutamakan amalan yang lebih penting berdasarkan skala keutamaan Islam. Prinsip: 1. Mendahulukan fardu berbanding sunat / 2. Mendahulukan maslahah yang lebih besar', ARRAY['SBP']::text[], 'SPM 2022'),
(7, 'Hadis', 'Soalan 1', 1, 'Senaraikan TUJUH golongan yang akan mendapat naungan Allah SWT pada Hari Kiamat', 4, '1. Pemimpin adil / 2. Pemuda dalam ketaatan / 3. Lelaki hatinya terikat masjid / 4. Dua orang berkasih sayang kerana Allah / 5. Menolak ajakan wanita cantik / 6. Bersedekah secara sembunyi / 7. Mengingati Allah sehingga mengalirkan air mata', ARRAY['SBP']::text[], 'SPM 2022'),
(8, 'Hadis', 'Soalan 1', 2, 'Terangkan DUA pengajaran daripada hadis tujuh golongan mendapat naungan Allah', 4, '1. Pemimpin wajib adil — kepimpinan adalah amanah besar / 2. Amalan ikhlas secara rahsia lebih bernilai — jauhkan sifat riak dalam beramal', ARRAY['SBP']::text[], 'SPM 2022'),
(9, 'Hadis', 'Soalan 1', 3, 'Apakah maksud berdikari? Nyatakan DUA kelebihannya dari aspek agama', 4, 'Maksud: Berusaha sendiri tanpa bergantung kepada orang lain secara tidak perlu. Kelebihan: 1. Elak meminta-minta yang menjatuhkan maruah Muslim / 2. Mencerminkan tawakkal yang betul', ARRAY['SBP']::text[], 'SPM 2024'),
(10, 'Hadis', 'Soalan 1', 4, 'Jelaskan DUA cara mengamalkan nilai berdikari dalam kehidupan sebagai pelajar', 4, '1. Berusaha bersungguh dalam pelajaran tanpa bergantung orang lain / 2. Urus keperluan harian sendiri tanpa membebankan ibu bapa', ARRAY['Ramalan']::text[], 'Ramalan 2026'),
(11, 'Hadis', 'Soalan 1', 5, 'Setiap orang adalah pemimpin. Jelaskan DUA tanggungjawab pemimpin keluarga (suami)', 4, '1. Memberi nafkah zahir kepada isteri dan anak-anak / 2. Mendidik ahli keluarga dengan ilmu agama dan akhlak mulia', ARRAY['Ramalan']::text[], 'Ramalan 2026'),
(12, 'Fiqah', 'Soalan 3', 1, 'Nyatakan LIMA rukun nikah dalam perkahwinan Islam', 2, '1. Pengantin lelaki / 2. Pengantin perempuan / 3. Wali / 4. Dua orang saksi / 5. Ijab dan qabul', ARRAY['SBP']::text[], 'SPM 2023'),
(13, 'Fiqah', 'Soalan 3', 2, 'Jelaskan DUA syarat sah wali dalam perkahwinan Islam', 4, '1. Islam — bukan Islam tidak sah menjadi wali / 2. Lelaki — perempuan tidak boleh menjadi wali dalam akad nikah', ARRAY['SBP']::text[], 'SPM 2023'),
(14, 'Fiqah', 'Soalan 3', 3, 'Terangkan DUA hikmah pensyariatan hukum faraid dalam Islam', 4, '1. Memastikan pembahagian harta pusaka adil — kekalkan silaturrahim / 2. Melindungi hak waris yang lemah seperti anak-anak kecil dan wanita', ARRAY['SBP']::text[], 'SPM 2023'),
(15, 'Fiqah', 'Soalan 3', 4, 'Nyatakan maksud haji dari segi istilah dan jelaskan DUA syarat wajib haji', 4, 'Maksud: Menziarahi Baitullah di Makkah pada waktu tertentu dengan syarat yang ditetapkan. Syarat: 1. Islam / 2. Berakal', ARRAY['SBP']::text[], 'SPM 2023'),
(16, 'Fiqah', 'Soalan 3', 5, 'Apakah maksud judi? Berikan DUA contoh perbuatan judi dalam kehidupan moden', 4, 'Maksud: Permainan atau pertaruhan yang mengandungi unsur untung-rugi secara tidak pasti. Contoh: 1. Membeli nombor ekor / 2. Bertaruh wang dalam permainan kad atau sukan', ARRAY['SBP']::text[], 'SPM 2024'),
(17, 'Fiqah', 'Soalan 3', 6, 'Nyatakan DUA perbezaan ibadat korban dan akikah', 4, '1. Masa: Korban (10-13 Zulhijjah) — Akikah (hari ke-7 selepas kelahiran) / 2. Tujuan: Korban (mendekatkan diri kepada Allah) — Akikah (syukur atas kelahiran anak)', ARRAY['SBP']::text[], 'SPM 2022 & 2023'),
(18, 'Fiqah', 'Soalan 3', 7, 'Jelaskan DUA sebab tanah pusaka di Malaysia lambat diselesaikan', 4, '1. Waris tidak tahu prosedur tuntutan — harta terbiar lama / 2. Pertelingkahan antara waris — tertangguh di mahkamah', ARRAY['Ramalan']::text[], 'Ramalan 2026'),
(19, 'Fiqah', 'Soalan 3', 8, 'Siapakah waris yang mendapat 1/4 harta pusaka? Nyatakan syaratnya', 2, 'Suami — apabila isteri meninggalkan anak atau cucu. Tanpa anak: suami dapat 1/2', ARRAY['Ramalan']::text[], 'Ramalan 2026'),
(22, 'Akhlak', 'Soalan 5 (a)', 3, 'Nyatakan maksud orang kurang upaya', 2, 'Seseorang yang tidak mempunyai keupayaan untuk melibatkan diri secara efektif dalam masyarakat dari segi fizikal, mental, intelektual atau pacaindera', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(23, 'Akhlak', 'Soalan 5 (a)', 4, 'Jelaskan adab terhadap orang kurang upaya', 2, '1. Memberi bantuan dan tunjuk ajar dalam urusan ibadah / 2. Memberi layanan dengan penuh kasih sayang / 3. Menyediakan kemudahan agar mereka mudah beribadah', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(24, 'Akhlak', 'Soalan 5 (a)', 5, 'Nyatakan dua adab terhadap orang sakit dalam aspek emosi', 2, '1. Memberikan semangat dan motivasi agar sabar dan redha / 2. Tidak mengganggu ketenteraman mereka seperti membuat bising', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(25, 'Akhlak', 'Soalan 5 (a)', 6, 'Nyatakan maksud bersikap benar', 2, 'Tidak berdusta dari segi perkataan, perkhabaran dan perbuatan', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(26, 'Akhlak', 'Soalan 5 (a)', 7, 'Jelaskan contoh bersikap benar yang diamalkan oleh Rasulullah SAW', 2, '1. Menyampaikan wahyu Allah dengan bersifat benar / 2. Bersikap benar walaupun ketika bergurau', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(27, 'Akhlak', 'Soalan 5 (a)', 8, 'Nyatakan maksud wasatiyah dari aspek kesederhanaan', 2, 'Melakukan sesuatu dengan sempurna, tidak melampaui batas dan mematuhi syarat', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(28, 'Akhlak', 'Soalan 5 (a)', 9, 'Terangkan hikmah melaksanakan prinsip wasatiyah', 2, 'Dapat menegakkan syiar Islam dengan menyempurnakan akhlak dan nilai murni / Masyarakat hidup aman damai dan bersatu padu', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(29, 'Akhlak', 'Soalan 5 (a)', 10, 'Jelaskan dua adab terhadap orang sakit', 2, '1. Mendoakan kesihatan mereka / 2. Memastikan tempat dan tubuh pesakit sentiasa bersih', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(30, 'Akhlak', 'Soalan 5 (a)', 11, 'Nyatakan dua tuntutan bersikap benar dalam menepati janji', 2, '1. Berjanji dengan sesuatu yang mampu ditunaikan / 2. Menunaikan apa yang telah dijanjikan', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(31, 'Akhlak', 'Soalan 5 (a)', 12, 'Jelaskan dua adab menyantuni orang sakit dari aspek fizikal', 2, '1. Memastikan tempat dan tubuh badan pesakit sentiasa bersih / 2. Menyediakan kemudahan dan keperluan asas kepada pesakit', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(32, 'Akhlak', 'Soalan 5 (b)', 1, 'Nyatakan maksud tawaduk', 2, 'Sikap kerendahan hati kepada Allah SWT dan sesama manusia', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(33, 'Akhlak', 'Soalan 5 (b)', 2, 'Jelaskan contoh tawaduk yang diamalkan oleh Rasulullah SAW', 2, 'Bersikap lemah lembut dengan kanak-kanak, mendahulukan salam dan membelai rambut mereka', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(34, 'Akhlak', 'Soalan 5 (b)', 3, 'Nyatakan maksud riak', 2, 'Melakukan amalan untuk dilihat dan dipuji oleh orang lain', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(35, 'Akhlak', 'Soalan 5 (b)', 4, 'Jelaskan dua contoh sifat riak', 2, '1. Bersedekah kerana mengharapkan pujian manusia / 2. Melaksanakan solat sunat hanya ketika dihadapan orang', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(38, 'Akhlak', 'Soalan 5 (b)', 7, 'Jelaskan dua cara meninggalkan sifat mazmumah', 2, '1. Sentiasa bermuhasabah diri agar terhindar daripada sifat mazmumah / 2. Mengamalkan sifat mahmudah setiap masa', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(39, 'Akhlak', 'Soalan 5 (b)', 8, 'Jelaskan dua cara meninggalkan sifat ujub', 2, '1. Sentiasa merendah diri / 2. Sentiasa mengingati bahawa segala kelebihan adalah pemberian Allah', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(40, 'Akhlak', 'Soalan 5 (b)', 9, 'Apakah maksud istiqamah?', 2, 'Ketaatan yang berterusan dalam melaksanakan suruhan Allah SWT dan menjauhi larangan-Nya', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(41, 'Akhlak', 'Soalan 5 (b)', 10, 'Jelaskan dua cara menanamkan sifat istiqamah dalam diri', 2, '1. Sentiasa bermujahadah melawan hawa nafsu / 2. Sentiasa berdoa memohon bantuan Allah SWT', ARRAY['Percubaan Negeri 2026']::text[], 'Percubaan 2026'),
(42, 'Sirah', 'Soalan 4 (a)', 1, 'Nyatakan sejarah ringkas Kerajaan Umaiyah — Pengasas', 1, 'Muawiyah bin Abi Sufyan', ARRAY['PP']::text[], 'Percubaan 2026'),
(43, 'Sirah', 'Soalan 4 (a)', 2, 'Nyatakan sejarah ringkas Kerajaan Umaiyah — Keluasan kerajaan', 1, 'Meliputi Semenanjung Arab, Parsi, Afrika Utara, Sepanyol hingga sempadan China', ARRAY['PP']::text[], 'Percubaan 2026'),
(44, 'Sirah', 'Soalan 4 (a)', 3, 'Nyatakan sejarah ringkas Kerajaan Umaiyah — Bilangan khalifah', 1, '14 orang khalifah', ARRAY['PP']::text[], 'Percubaan 2026'),
(45, 'Sirah', 'Soalan 4 (a)', 4, 'Nyatakan sejarah ringkas Kerajaan Umaiyah — Khalifah terakhir', 1, 'Marwan bin Muhammad (Marwan II)', ARRAY['PP']::text[], 'Percubaan 2026'),
(46, 'Sirah', 'Soalan 4 (a)', 5, 'Jelaskan sumbangan Abdul Malik bin Marwan', 2, '1. Menyeragamkan mata wang Islam (dinar dan dirham) / 2. Menjadikan bahasa Arab sebagai bahasa rasmi pentadbiran', ARRAY['PP']::text[], 'Percubaan 2026'),
(47, 'Sirah', 'Soalan 4 (a)', 6, 'Jelaskan dua faktor kegemilangan Kerajaan Umaiyah dari aspek politik', 4, '1. Kepimpinan khalifah yang kuat dan tegas — kestabilan politik terjamin / 2. Sistem pentadbiran tersusun dengan melantik gabenor di setiap wilayah', ARRAY['JHR', 'KEL']::text[], 'Percubaan 2026'),
(48, 'Sirah', 'Soalan 4 (a)', 7, 'Senaraikan dua khalifah Khulafa al-Rasyidin', 2, '1. Abu Bakar al-Siddiq / 2. Umar bin al-Khattab / 3. Uthman bin Affan / 4. Ali bin Abi Talib (pilih 2)', ARRAY['SBH']::text[], 'Percubaan 2026'),
(49, 'Sirah', 'Soalan 4 (a)', 8, 'Jelaskan dua pencapaian Khulafa al-Rasyidin dari aspek ketenteraan', 2, '1. Membebaskan wilayah Parsi dan Rom Byzantine / 2. Menyebarkan Islam ke seluruh Semenanjung Arab dan luar melalui jihad', ARRAY['SBH']::text[], 'Percubaan 2026'),
(50, 'Sirah', 'Soalan 4 (a)', 9, 'Nyatakan sejarah pemerintahan Kerajaan Uthmaniyah secara ringkas', 2, 'Diasaskan Uthman bin Ertugrul 1299M di Anatolia / Berpusat di Istanbul / Berakhir 1924M / Empayar Islam terbesar', ARRAY['SBH', 'KEL']::text[], 'Percubaan 2026'),
(51, 'Sirah', 'Soalan 4 (a)', 10, 'Terangkan iktibar daripada pemerintahan Kerajaan Uthmaniyah', 2, '1. Pemimpin adil dan bertakwa membawa kemakmuran negara / 2. Perpaduan umat Islam menjadi asas kekuatan mempertahankan negara', ARRAY['SBH']::text[], 'Percubaan 2026'),
(52, 'Sirah', 'Soalan 4 (a)', 11, 'Nyatakan dua sumbangan Murad I bin Urkhan kepada Kerajaan Uthmaniyah', 2, '1. Menubuhkan pasukan tentera Janissari / 2. Menakluki Adrianople (Edirne) sebagai ibu kota baharu', ARRAY['SBH']::text[], 'Percubaan 2026'),
(53, 'Sirah', 'Soalan 4 (a)', 12, 'Jelaskan faktor kemerosotan Kerajaan Uthmaniyah', 2, '1. Kepimpinan sultan yang lemah — pentadbiran tidak teratur / 2. Campur tangan kuasa Barat melemahkan kedaulatan', ARRAY['KEL']::text[], 'Percubaan 2026'),
(54, 'Sirah', 'Soalan 4 (a)', 13, 'Siapakah khalifah pertama Khulafa al-Rasyidin', 1, 'Saidina Abu Bakar al-Siddiq r.a.', ARRAY['N9']::text[], 'Percubaan 2026'),
(55, 'Sirah', 'Soalan 4 (a)', 14, 'Jelaskan pencapaian Abu Bakar al-Siddiq dari aspek agama', 1, 'Mengumpulkan al-Quran dalam satu mushaf rasmi selepas ramai huffaz gugur dalam Perang Yamamah', ARRAY['N9']::text[], 'SPM sebenar (berulang)'),
(56, 'Sirah', 'Soalan 4 (a)', 15, 'Nyatakan riwayat hidup Imam al-Syafie secara ringkas', 2, 'Nama penuh: Muhammad bin Idris al-Syafie / Lahir 150H (767M) di Gaza / Pengasas Mazhab Syafie / Wafat 820M di Mesir', ARRAY['SWK']::text[], 'Percubaan 2026'),
(57, 'Sirah', 'Soalan 4 (a)', 16, 'Jelaskan dua sumbangan tokoh dalam tamadun Islam', 2, '1. Menghasilkan Kitab al-Umm dan al-Risalah / 2. Mendidik ramai ulama yang menyebarkan ilmu Islam ke seluruh dunia', ARRAY['SWK']::text[], 'Percubaan 2026'),
(60, 'Sirah', 'Soalan 4 (a)', 19, 'Nyatakan sejarah ringkas Kerajaan Abbasiah', 2, 'Diasaskan Abu al-Abbas al-Saffah 750M / Berpusat di Baghdad / Berakhir 1258M (diserang Mongol) / Zaman kegemilangan ilmu', ARRAY['TER']::text[], 'Percubaan 2026'),
(61, 'Sirah', 'Soalan 4 (a)', 20, 'Nyatakan dua ciri kepimpinan Saidina Uthman bin Affan', 2, '1. Dermawan dan pemurah — menyumbang untuk keperluan umat Islam / 2. Lembut dan penyayang dalam memimpin', ARRAY['KDH', 'PRK']::text[], 'Percubaan 2026'),
(62, 'Sirah', 'Soalan 4 (a)', 21, 'Jelaskan dua faktor kemerosotan Kerajaan Umaiyah dari aspek sosial', 2, '1. Diskriminasi terhadap mawali (bukan Arab) — rasa tidak puas hati / 2. Kemewahan melampau pembesar — jurang kaya-miskin melebar', ARRAY['PHG']::text[], 'Percubaan 2026'),
(63, 'Sirah', 'Soalan 4 (a)', 22, 'Nyatakan dua pusat pemerintahan Kerajaan Uthmaniyah', 2, '1. Bursa (1326M) / 2. Edirne / 3. Istanbul (1453M) — pilih 2', ARRAY['PHG']::text[], 'Percubaan 2026'),
(64, 'Sirah', 'Soalan 4 (a)', 23, 'Terangkan faktor kegemilangan Kerajaan Uthmaniyah dari aspek sosial', 2, '1. Sistem millet — rakyat pelbagai agama bebas mengamalkan kepercayaan — keharmonian sosial / 2. Kemudahan madrasah, hospital, rumah anak yatim disediakan', ARRAY['PHG']::text[], 'Percubaan 2026'),
(65, 'Sirah', 'Soalan 4 (a)', 24, 'Senaraikan dua khalifah selain Saidina Ali bin Abi Talib', 2, '1. Abu Bakar al-Siddiq / 2. Umar bin al-Khattab / 3. Uthman bin Affan (pilih 2)', ARRAY['MEL']::text[], 'Percubaan 2026'),
(66, 'Sirah', 'Soalan 4 (b/c)', 1, 'Nyatakan secara ringkas riwayat hidup Salahuddin al-Ayubi', 2, 'Nama penuh: Salah al-Din Yusuf bin Najmuddin Ayyubi / Lahir 1138M di Tikrit / Pengasas Dinasti Ayyubiah / Bebaskan Baitul Maqdis 1187M / Wafat 1193M', ARRAY['PP', 'JHR', 'N9', 'TER', 'KDH', 'PRK', 'MEL']::text[], 'Percubaan 2026'),
(67, 'Sirah', 'Soalan 4 (b/c)', 2, 'Terangkan sumbangan Salahuddin al-Ayubi dalam aspek pentadbiran', 2, 'Mengubah dewan istana menjadi hospital al-Bimaristan al-Atiq / Gedung ubatan diagihkan mengikut gred kepada pesakit', ARRAY['PRK']::text[], 'Percubaan 2026'),
(68, 'Sirah', 'Soalan 4 (b/c)', 3, 'Jelaskan sumbangan Salahuddin al-Ayubi dalam aspek keilmuan', 2, 'Mengembalikan pegangan akidah ASWJ dalam sistem pendidikan / Menghapuskan pengaruh Syiah Fatimiyyah', ARRAY['PRK']::text[], 'Percubaan 2026'),
(69, 'Sirah', 'Soalan 4 (b/c)', 4, 'Jelaskan dua sumbangan Salahuddin al-Ayubi', 2, '1. Membebaskan Baitul Maqdis daripada Tentera Salib 1187M / 2. Memuliakan orang yang warak dan soleh serta menggerakkan dakwah', ARRAY['JHR']::text[], 'Percubaan 2026'),
(70, 'Sirah', 'Soalan 4 (b/c)', 5, 'Terangkan iktibar daripada keunggulan Salahuddin al-Ayubi', 2, '1. Pemimpin perlu adil dan amanah dalam tanggungjawab / 2. Semangat jihad dan kecintaan kepada Islam menjadi pendorong perjuangan', ARRAY['JHR']::text[], 'Percubaan 2026'),
(71, 'Sirah', 'Soalan 4 (b/c)', 6, 'Siapakah tokoh yang digelar Zun Nurain (Pemilik dua cahaya)?', 2, 'Saidina Uthman bin Affan r.a. / Berkahwin dengan dua puteri Rasulullah: Ruqayyah dan Ummu Kulthum', ARRAY['JHR']::text[], 'Percubaan 2026'),
(72, 'Sirah', 'Soalan 4 (b/c)', 7, 'Nyatakan nama mushaf yang diselaraskan penulisannya oleh Uthman bin Affan', 2, 'Mushaf al-Imam / Mushaf Uthmaniah / Diselaraskan dalam satu lahjah (dialek) Quraisy', ARRAY['JHR']::text[], 'Percubaan 2026'),
(73, 'Sirah', 'Soalan 4 (b/c)', 8, 'Senaraikan dua khalifah terkenal dalam Kerajaan Uthmaniah', 2, '1. Sultan Muhammad al-Fateh / 2. Sultan Sulaiman al-Qanuni', ARRAY['N9']::text[], 'Percubaan 2026'),
(74, 'Sirah', 'Soalan 4 (b/c)', 9, 'Jelaskan dua faktor kegemilangan Kerajaan Uthmaniah', 2, '1. Kepimpinan sultan kuat, adil dan bertakwa — kestabilan terjamin / 2. Tentera Janissari terlatih, berdisiplin dan bersemangat jihad', ARRAY['N9']::text[], 'Percubaan 2026'),
(75, 'Sirah', 'Soalan 4 (b/c)', 10, 'Terangkan iktibar daripada pemerintahan Kerajaan Uthmaniah', 2, '1. Pemimpin adil dan bertakwa membawa kegemilangan / 2. Perpaduan umat Islam menjadi asas kekuatan', ARRAY['N9']::text[], 'Percubaan 2026'),
(76, 'Sirah', 'Soalan 4 (b/c)', 11, 'Siapakah pengasas Kerajaan Uthmaniah?', 2, 'Uthman bin Ertugrul (Osman I) / Sekitar 1299M di Anatolia', ARRAY['SWK']::text[], 'Percubaan 2026'),
(80, 'Sirah', 'Soalan 4 (b/c)', 15, 'Siapakah tokoh yang dipenjarakan kerana mempertahankan akidah?', 1, 'Imam Ahmad bin Hanbal / Dipenjarakan kerana menolak fahaman Muktazilah semasa pemerintahan al-Muktasim', ARRAY['TER']::text[], 'Percubaan 2026'),
(81, 'Sirah', 'Soalan 4 (b/c)', 16, 'Nyatakan hasil karya Imam Ahmad bin Hanbal dalam tamadun Islam', 1, 'Kitab al-Musnad / Koleksi lebih 40000 hadis', ARRAY['TER']::text[], 'Percubaan 2026'),
(82, 'Sirah', 'Soalan 4 (b/c)', 17, 'Siapakah tokoh yang mempunyai murid terkenal seperti Yusuf al-Qardawi', 2, 'Hassan al-Banna / Pengasas gerakan Ikhwanul Muslimin di Mesir', ARRAY['PHG']::text[], 'Percubaan 2026'),
(83, 'Sirah', 'Soalan 4 (b/c)', 18, 'Nyatakan sumbangan Hassan al-Banna dalam organisasi', 1, 'Mengasaskan Ikhwanul Muslimin pada 22 Mac 1928M di Ismailia Mesir', ARRAY['PHG']::text[], 'SPM 2024'),
(84, 'Sirah', 'Soalan 4 (b/c)', 19, 'Senaraikan dua hasil karya Hassan al-Banna', 2, '1. Majmuah Rasail Hassan al-Banna / 2. Muzakkirat al-Dakwah wa al-Daiyah', ARRAY['PHG']::text[], 'SPM 2024'),
(85, 'Sirah', 'Soalan 4 (b/c)', 20, 'Jelaskan dua pencapaian Khulafa al-Rasyidin dalam bidang agama', 2, '1. Penyusunan dan pembukuan al-Quran (Mushaf Uthmaniah) / 2. Penyebaran Islam ke luar Semenanjung Arab — Parsi, Rom, Syria, Mesir', ARRAY['SBH']::text[], 'Percubaan 2026'),
(86, 'Sirah', 'Soalan 4 (b/c)', 21, 'Jelaskan DUA sumbangan Sultan Muhammad al-Fateh kepada tamadun Islam', 4, '1. Menakluki Constantinople 1453M — pusat Islam gemilang / 2. Membina masjid, madrasah dan perpustakaan di Istanbul', ARRAY['Ramalan']::text[], 'Ramalan 2026'),
(87, 'Sirah', 'Soalan 4 (b/c)', 22, 'Nyatakan DUA ketinggian akhlak Hassan al-Banna dalam perjuangannya', 4, '1. Sabar dan tabah menghadapi tekanan — teruskan dakwah walaupun diancam / 2. Ikhlas berjuang semata-mata kerana Allah', ARRAY['SBP']::text[], 'SPM 2024'),
(10001, 'Al-Quran', 'Soalan 1 (a)', 1, 'Firman Allah SWT (Surah al-An''am: 70).
Ayat di atas menjelaskan tentang larangan mempersendakan agama.

Nyatakan dua bentuk perbuatan mempersendakan agama.', 2, 'Mana-mana dua (2 isi × 1m):
- Merasa bangga mempersendakan nama Allah SWT
- Mengejek dan menghina sunnah Rasulullah SAW
- Menghina golongan ulama dan orang soleh
- Mentafsir al-Quran mengikut hawa nafsu dan logik akal semata-mata
- Menyanjungi perbuatan maksiat
- Menghalalkan yang haram dan mengharamkan yang halal', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10002, 'Al-Quran', 'Soalan 1 (a)', 2, 'Jelaskan dua kesan mempersendakan agama.', 2, 'Mana-mana dua (2 isi × 1m):
- Boleh membatalkan iman
- Tidak dipandang oleh Allah SWT di akhirat
- Tidak mendapat kejayaan di dunia dan akhirat', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10003, 'Al-Quran', 'Soalan 1 (a)', 3, 'Seorang pelajar muslim makan secara terbuka di kantin sekolah pada waktu rehat di bulan Ramadan.

Berdasarkan pernyataan di atas, kemukakan implikasi perbuatan tersebut.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Menjatuhkan maruah diri
- Mendapat pandangan negatif daripada rakan yang bukan beragama Islam
- Mendorong perbuatan mempersendakan agama', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10004, 'Al-Quran', 'Soalan 1 (a)', 4, 'Bagaimana cara untuk membendung perbuatan ini supaya tidak berleluasa?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Menguatkuasakan disiplin / melapor kepada guru
- Menasihati pelaku supaya menghormati bulan puasa
- Menjauhkan diri daripada murid yang makan di khalayak ramai
- Mengajak mereka supaya mendalami ajaran agama', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10005, 'Hadis', 'Soalan 1 (b)', 1, 'Sabda Rasulullah SAW (Muttafaq ''alaih) tentang tujuh golongan yang mendapat naungan Allah SWT pada hari tiada naungan melainkan naungan-Nya.
Hadis di atas menerangkan tentang golongan yang mendapat naungan Allah SWT.

Apakah maksud pemuda yang hidupnya taat beribadat kepada Allah SWT?', 2, 'Pemuda yang memenuhi masa dengan melakukan ibadah kepada Allah SWT sama ada ibadah wajib atau sunat. (2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10006, 'Hadis', 'Soalan 1 (b)', 2, 'Jelaskan dua contoh pemuda yang hidupnya taat beribadat kepada Allah SWT.', 2, 'Mana-mana dua (2 isi × 1m):
- Melaksanakan tuntutan solat lima waktu dan ibadat puasa dengan sempurna
- Melazimi qiamullail
- Sentiasa membaca al-Quran
- Mengalunkan zikir setiap masa', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10007, 'Hadis', 'Soalan 1 (b)', 3, 'Islam menganjurkan agar sedekah dilakukan secara sembunyi.

Bagaimana amalan ini dapat membentuk keperibadian seorang muslim?', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Melahirkan rasa keikhlasan dalam diri
- Dapat mendekatkan diri kepada Allah SWT
- Menjauhkan sifat riak / ujub dalam diri', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10008, 'Al-Quran', 'Soalan 1 (c)', 1, 'Nyatakan hukum bagi Mad Lazim di bawah:
(i) الٓمٓصٓ
(ii) ٱلضَّآلِّينَ', 2, '(i) Mad Lazim Harfi Mukhaffaf (1m)
(ii) Mad Lazim Kalimi Musaqqal (1m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10009, 'Akidah', 'Soalan 2 (a)', 1, 'Nyatakan maksud nama Allah SWT al-Muntaqim.', 2, 'Nama Allah yang menunjukkan bahawa Allah SWT Maha Pembalas dengan menimpakan azab terhadap orang yang melampaui batas. (2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10010, 'Akidah', 'Soalan 2 (a)', 2, 'Terangkan kefahaman mengenai nama Allah SWT al-Muntaqim.', 2, 'Mana-mana satu (1 isi × 2m):
- Allah SWT memberikan pembalasan dengan seksaan neraka terhadap orang yang menolak peringatan al-Quran
- Allah SWT menimpakan azab dalam peristiwa al-Dukhan: orang Quraisy ditimpa kemarau panjang sehingga debu seperti asap menutupi mereka kerana menolak dakwah Rasulullah SAW
- Allah SWT memberikan pembalasan terhadap orang yang menentang agama-Nya setelah diutuskan rasul dan diberikan keterangan yang jelas', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10011, 'Akidah', 'Soalan 2 (a)', 3, 'Beriman dengan nama Allah SWT al-Muntaqim membentuk keperibadian mulia.

Kemukakan hujah anda untuk menyokong pernyataan di atas.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Takut melakukan kejahatan kerana bimbang dengan balasan Allah SWT
- Mendorong untuk melakukan kebaikan dengan menghindari kemungkaran
- Berakhlak mulia dengan melaksanakan kebaikan', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10012, 'Akidah', 'Soalan 2 (b)', 1, 'Nyatakan dua perkara yang membatalkan iman melalui iktikad selain al-Uluhiyyah.', 2, 'Mana-mana dua (2 isi × 1m):
- Al-Nubuwwah
- Al-Ghaibiyyat
- Al-Syariah', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10013, 'Akidah', 'Soalan 2 (b)', 2, 'Firman Allah SWT yang bermaksud: "Wahai orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa dan janganlah sekali-kali kamu mati melainkan dalam keadaan seorang muslim." (Surah Ali-Imran: 102)

Mengapa peringatan di atas perlu diambil berat?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Mengekalkan keimanan dan ketakwaan berlandaskan akidah yang benar sehingga akhir hayat
- Dirahmati Allah hingga ke syurga kerana kekal dalam iman dan takwa
- Mengelakkan diri daripada kekal dalam neraka Allah disebabkan rosak akidah', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10014, 'Akidah', 'Soalan 2 (b)', 3, 'Ramalkan akibat jika perkara tersebut diabaikan. Huraikan hujah anda.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Jiwa tidak tenang kerana berhadapan masalah akidah dan iman
- Terdorong melakukan keburukan dan maksiat yang berterusan
- Hidup tidak diberkati Allah SWT kerana rosak akidah', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10015, 'Akidah', 'Soalan 2 (c)', 1, 'Antara aliran yang bertentangan dengan akidah Ahli Sunnah Waljamaah ialah Khawarij dan Muktazilah.

Nyatakan sejarah salah satu daripada aliran tersebut.', 2, 'Mana-mana satu (2m):
- Khawarij: kumpulan pengikut Saidina Ali bin Abu Talib r.a. yang berpaling tadah kerana tidak berpuas hati dengan keputusan Majlis Tahkim
- Muktazilah: kumpulan yang diasaskan oleh Wasil bin Ata'' setelah berlaku perbezaan pendapat antara beliau dengan gurunya Hasan al-Basri tentang kedudukan pelaku dosa besar', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10016, 'Akidah', 'Soalan 2 (c)', 2, 'Jelaskan kelebihan berpegang dengan aliran Ahli Sunnah Waljamaah.', 2, 'Mana-mana satu (1 isi × 2m):
- Mendapat keredaan Allah SWT
- Menjadi asas penerimaan sesuatu amalan
- Menjamin keamanan negara
- Mengelak umat Islam daripada terjebak dengan ajaran sesat
- Membersihkan akidah daripada sebarang bentuk kekeliruan
- Menghindarkan umat Islam daripada fahaman yang melampau', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10017, 'Fiqah', 'Soalan 3 (a)', 1, 'Ibadah haji merangkumi rukun dan perkara wajib haji.

Bilakah waktu jemaah haji melaksanakan wukuf?', 2, 'Bermula dari masuk waktu Zohor 9 Zulhijjah hingga sebelum masuk waktu Subuh pada 10 Zulhijjah. (2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10018, 'Fiqah', 'Soalan 3 (a)', 2, 'Terangkan dua hikmah ibadat haji dari aspek ekonomi.', 4, 'Mana-mana dua (2 × [isi 1m + huraian 1m]):
- Meningkatkan taraf hidup umat Islam dengan menabung dalam Tabung Haji — dana umat Islam meningkat
- Merancakkan perniagaan dan pelancongan — pertemuan jemaah dari serata dunia membuka peluang perniagaan antarabangsa
- Pengagihan harta zakat/sedekah — memupuk jiwa pemurah
- Pergerakan jemaah haji yang ramai — mendorong pembangunan infrastruktur dan pengangkutan yang lebih baik
- Berlakunya perbincangan ekonomi — membuka ruang usahawan muslim bertukar pandangan perniagaan', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10019, 'Fiqah', 'Soalan 3 (a)', 3, '[Rangsangan: poster "BMI 37.5 Jadi Syarat Wajib Haji 2026" — mulai tahun 2026, bakal jemaah haji dengan BMI melebihi 37.5 akan dikira tidak melepasi saringan kesihatan haji.]

Berdasarkan syarat di atas, bagaimanakah seorang jemaah dapat merealisasikan impiannya untuk menunaikan haji?', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Mengawal pemakanan dengan mengambil nutrisi yang cukup
- Melakukan aktiviti ringan seperti berjalan kaki
- Pemantauan kesihatan secara berkala', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10020, 'Fiqah', 'Soalan 3 (b)', 1, '[Rangsangan: poster "Hentikan Keganasan Rumah Tangga".]

Apakah punca berlakunya masalah di atas?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Kegagalan suami menanggung nafkah isteri dan anak
- Sifat panas baran, mabuk dan pengaruh dadah
- Masalah mental dan isu poligami
- Pasangan curang
- Jahil tentang hukum-hakam dan tanggungjawab', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10021, 'Fiqah', 'Soalan 3 (b)', 2, 'Bagaimanakah seorang isteri dapat menyelamatkan dirinya daripada kemelut ini? Huraikan pendapat anda.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Prosiding jenayah atau tindakan undang-undang
- Membuat permohonan fasakh atau khuluk', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10022, 'Fiqah', 'Soalan 3 (c)', 1, 'Apakah maksud rujuk?', 2, 'Hak suami untuk menyambung kembali ikatan perkahwinan dengan isteri yang diceraikan dalam tempoh idah. (2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10023, 'Fiqah', 'Soalan 3 (c)', 2, 'Jelaskan dua syarat rujuk.', 2, 'Mana-mana dua (2 isi × 1m):
- Dengan kerelaan sendiri
- Bukan perceraian secara fasakh atau khuluk
- Bukan diceraikan dengan talak tiga
- Isteri yang diceraikan masih dalam tempoh idah
- Ada lafaz rujuk', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10024, 'Sirah', 'Soalan 4 (a)', 1, 'Nyatakan dua ciri kepimpinan Khalifah Ali bin Abi Talib.', 2, 'Mana-mana dua (2 isi × 1m):
- Tegas
- Berani
- Berilmu
- Berpandangan jauh', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10025, 'Sirah', 'Soalan 4 (a)', 2, 'Jelaskan pencapaian Khalifah Uthman bin Affan dalam bidang ketenteraan.', 2, 'Menubuhkan angkatan tentera laut Islam yang pertama bagi tujuan keselamatan dan peluasan kuasa. (1 isi × 2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10026, 'Sirah', 'Soalan 4 (a)', 3, 'Khalifah Uthman bin Affan telah mengambil inisiatif menubuhkan jawatankuasa khas untuk mengumpul dan membukukan al-Quran semasa pemerintahannya.

Bagaimana tindakan tersebut dapat membuktikan beliau seorang pemimpin yang berpandangan jauh? Huraikan.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Menjamin kesucian dan keaslian al-Quran
- Mengelakkan berlakunya penyelewengan atau perubahan pada masa hadapan
- Langkah pencegahan awal terhadap kemungkinan hilangnya ayat-ayat al-Quran akibat kematian para huffaz', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10027, 'Sirah', 'Soalan 4 (b)', 1, 'Nyatakan sejarah ringkas kerajaan Umaiyah.', 2, 'Mana-mana dua (2 isi × 1m):
- Asal penubuhan: sempena nama Umaiyah bin Abdul Syams
- Pengasas / khalifah pertama: Muawiyah bin Abi Sufian
- Tempoh memerintah: 41H – 132H
- Keluasan: meliputi sebahagian besar benua Afrika, Asia dan Eropah
- Bilangan khalifah: 14 orang
- Khalifah terkenal: Muawiyah bin Abi Sufian, Abdul Malik bin Marwan, al-Walid bin Abdul Malik, Umar bin Abdul Aziz
- Khalifah terakhir: Marwan bin Muhammad
- Pusat pemerintahan: Damsyik, Syria', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10028, 'Sirah', 'Soalan 4 (b)', 2, 'Jelaskan dua faktor kemerosotan kerajaan Umaiyah dari aspek akhlak.', 2, '2 isi × 1m:
- Khalifah mengamalkan cara hidup mewah dan boros dalam perbelanjaan hingga menimbulkan rasa tidak puas hati rakyat
- Keruntuhan moral dalam kalangan khalifah kerana cenderung kepada hiburan dan kekejaman', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10029, 'Sirah', 'Soalan 4 (c)', 1, 'Nyatakan riwayat hidup Sultan Muhammad al-Fateh.', 2, 'Mana-mana dua (2 isi × 1m):
- Nama penuh: Muhammad al-Fateh bin Murad II
- Tarikh lahir: 833H / 1429M
- Tarikh mangkat: 886H / 1481M
- Tempoh pemerintahan: 31 tahun
- Jawatan: pemerintah ketujuh kerajaan Uthmaniyah
- Sumbangan (1m sahaja): membuka kota Constantinople 857H/1453M; menyatukan empayar di utara Balkan bagi mengelak serangan Hungary; mewakafkan Hagia Sophia sebagai masjid; membina kompleks al-Fateh', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10030, 'Sirah', 'Soalan 4 (c)', 2, 'Sultan Muhammad al-Fateh telah mengkaji kelemahan yang ada pada kota Constantinople serta sebab kegagalan serangan terdahulu sebelum melakukan serangan. Setelah itu, baginda akan membawa ke meja perbincangan bersama jeneral-jeneral perangnya. (Sumber ubahsuai: www.yadim.com, 4 Ogos 2015)

Mengapakah beliau melakukan tindakan tersebut?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Merancang strategi yang lebih berkesan dengan mengambil iktibar daripada kegagalan serangan terdahulu
- Memastikan kejayaan misi penaklukan melalui perbincangan bersama pakar bagi mendapatkan idea dan pandangan terbaik', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10031, 'Sirah', 'Soalan 4 (c)', 3, 'Huraikan bagaimana anda mempraktikkan sikap tersebut untuk berjaya dalam pelajaran.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Mengenal pasti kelemahan diri dalam pelajaran
- Mengenal pasti topik yang tidak dikuasai supaya dapat diperbaiki
- Menetapkan jadual dan strategi yang sesuai
- Berbincang dengan guru dan rakan untuk mendapatkan pandangan
- Mengambil iktibar daripada kesilapan lalu', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10032, 'Akhlak', 'Soalan 5 (a)', 1, 'Perbuatan menziarahi orang yang sedang sakit merupakan amalan mulia.

Jelaskan dua adab terhadap orang sakit dari aspek ibadah.', 2, '2 isi × 1m:
- Mendoakan kesihatan mereka
- Membantu mereka yang ingin melakukan ibadah seperti membantu mengambil wuduk', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10033, 'Akhlak', 'Soalan 5 (a)', 2, 'Terangkan dua hikmah beradab kepada orang sakit.', 4, 'Mana-mana dua (2 × [isi 1m + huraian 1m]):
- Menggembirakan pesakit — agar hatinya tenang dalam menempuh ujian Allah SWT
- Mengeratkan ukhuwah sesama anggota masyarakat — agar hidup diberkati Allah SWT
- Melahirkan keinsafan — kerana diberi nikmat kesihatan setelah melihat penderitaan pesakit', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10034, 'Akhlak', 'Soalan 5 (a)', 3, 'Sabda Rasulullah SAW yang bermaksud: "Apabila kamu menghadiri (menziarahi) orang sakit, maka katakanlah perkara-perkara yang baik." (Riwayat Muslim)

Sokong saranan hadis di atas dan kaitkannya dengan emosi pesakit.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Memberi semangat dan motivasi kepada pesakit
- Pesakit berasa dihargai / gembira
- Menanamkan sikap positif kepada pesakit', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10035, 'Akhlak', 'Soalan 5 (b)', 1, '[Rangsangan: kartun — lelaki A merakam swafoto dengan telefon sambil menghulurkan sedekah kepada seorang yang miskin (B) dan berkata, "Mesti aku popular lepas ni."]

Apakah maksud ujub?', 2, 'Berasa bangga dengan amalan dan kelebihan yang ada pada diri sendiri. (2m)', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10036, 'Akhlak', 'Soalan 5 (b)', 2, 'Jelaskan contoh ujub.', 2, 'Mana-mana satu (1 isi × 2m):
- Berasa bangga dengan kehebatan ilmu yang dimiliki
- Merasa diri lebih soleh berbanding orang lain
- Berasa kagum pada diri sendiri kerana mampu berpuasa penuh Ramadan diikuti enam hari puasa sunat Syawal berturut-turut
- Merasakan isterinya paling cantik kerana berkahwin dengan seorang ratu cantik', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10037, 'Akhlak', 'Soalan 5 (b)', 3, 'Jelaskan mengapa Islam melarang perbuatan lelaki A.', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Menjatuhkan maruah diri
- Boleh merosakkan pahala sedekah
- Menyebabkan syirik khafi
- Menjejaskan keikhlasan', ARRAY['SEL']::text[], 'Percubaan 2026'),
(10038, 'Akhlak', 'Soalan 5 (b)', 4, 'Huraikan kesan sekiranya perbuatan tersebut dinormalisasikan dalam masyarakat.', 4, 'Rubrik 4m: 1m isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/dalil; 4m huraian lengkap dengan olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Hubungan masyarakat renggang
- Merosakkan imej penerima sedekah
- Imej masyarakat Islam dipandang rendah', ARRAY['SEL']::text[], 'Percubaan 2026'),
(20001, 'Al-Quran', 'Soalan 1 (a)', 1, 'Firman Allah SWT (Surah al-Mu''minun: 4-9).
Ayat di atas menjelaskan tentang ciri-ciri mukmin yang berjaya.

Nyatakan dua ciri tersebut selain memelihara solat.', 2, 'Mana-mana dua (2 isi × 1m):
- Menunaikan zakat
- Menjaga kehormatan / maruah / kemaluan diri
- Menjaga amanah dan janji
(Tambahan tulisan tangan dalam skema asal: beriman kepada Allah; khusyuk dalam solat; menjauhi perbuatan dan perkataan sia-sia)', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20002, 'Al-Quran', 'Soalan 1 (a)', 2, 'Jelaskan dua akibat salah laku seksual.', 2, 'Mana-mana dua (2 isi × 1m):
- Menggugat keharmonian hidup bermasyarakat
- Hilang kelayakan dalam mewarisi harta pusaka bagi anak yang tidak sah taraf
- Menyebabkan keruntuhan institusi keluarga
- Menyebabkan gangguan emosi dan mental
- Terdedah kepada penyakit fizikal seperti AIDS dan sifilis
- Mencetuskan pelbagai perbuatan jenayah
Catatan: Jawapan hendaklah ditulis dalam ayat yang lengkap.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20003, 'Al-Quran', 'Soalan 1 (a)', 3, '[Rangsangan: kaligrafi "Hayya ''ala al-solah" — maksudnya: Marilah menunaikan solat.]

Mengapakah terdapat segelintir remaja hari ini mengabaikan seruan di atas?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Lalai dengan hiburan / media
- Mengutamakan dunia berbanding akhirat
- Ilmu agama yang dipelajari tidak diamalkan
- Terpengaruh dengan budaya Barat / gejala sosial
- Tidak takut pada azab Allah SWT
- Mempunyai iman yang lemah
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20004, 'Al-Quran', 'Soalan 1 (a)', 4, 'Huraikan bagaimana anda memastikan ibadat tersebut dilaksanakan dengan sempurna.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Berwuduk dengan sempurna
- Menunaikan solat dalam waktu solat
- Menyegerakan solat / tidak melengahkan solat
- Menunaikan solat secara berjemaah
- Mempelajari ilmu berkaitan solat dengan lebih mendalam
- Menetapkan waktu solat bersesuaian dengan jadual kerja atau belajar
- Menyempurnakan rukun dan syarat sah solat
- Menunaikan solat dengan penuh khusyuk
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20005, 'Hadis', 'Soalan 1 (b)', 1, 'Sabda Rasulullah SAW (Muttafaq ''alaih), daripada Abu Hurairah r.a.: Jauhilah tujuh perkara yang membinasakan — syirik kepada Allah, sihir, membunuh jiwa yang diharamkan Allah kecuali dengan hak, memakan riba, memakan harta anak yatim, lari dari medan perang, dan menuduh zina wanita mukminah yang suci lagi lalai.
Hadis di atas menjelaskan tujuh dosa besar yang wajib dihindari.

Apakah maksud membunuh?', 2, 'Perbuatan menghilangkan nyawa seseorang. (1 isi × 2m)', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20006, 'Hadis', 'Soalan 1 (b)', 2, 'Senaraikan dua contoh perbuatan membunuh.', 2, 'Mana-mana dua (2 isi × 1m):
- Menembak dengan senjata api
- Menikam dengan pisau
- Meletakkan racun dalam makanan
- Menjerut leher dengan tali
- Mencekik leher
- Menekup muka dengan bantal / plastik
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20007, 'Hadis', 'Soalan 1 (b)', 3, 'Perbuatan qazaf menyebabkan perpecahan dalam kalangan keluarga dan masyarakat.

Huraikan hujah anda untuk membenarkan pernyataan di atas.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Qazaf menjatuhkan maruah keluarga
- Memutuskan hubungan kekeluargaan
- Mendatangkan kebencian dalam keluarga
- Masyarakat memandang serong kepada mangsa qazaf
- Berlaku pergaduhan dalam keluarga / masyarakat
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20008, 'Al-Quran', 'Soalan 1 (c)', 1, 'Nyatakan jenis mad lazim bagi potongan ayat berikut:
(i) وَلَا ٱلضَّآلِّينَ
(ii) كٓهيعٓصٓ', 2, '(i) Mad Lazim Kalimi Musaqqal (1m)
(ii) Mad Lazim Harfi Mukhaffaf (1m)', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20009, 'Akidah', 'Soalan 2 (a)', 1, 'Apakah maksud nama Allah SWT al-Muntaqim?', 2, 'Nama Allah SWT yang menunjukkan bahawa Allah SWT Maha Pembalas (1m) dengan menimpakan azab kepada orang yang melampaui batas (1m).', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20010, 'Akidah', 'Soalan 2 (a)', 2, 'Jelaskan bukti kefahaman nama Allah SWT al-Muntaqim.', 2, 'Mana-mana satu (1 isi × 2m):
- Allah SWT memberikan pembalasan neraka terhadap orang yang menolak peringatan al-Quran
- Allah SWT menimpakan azab dalam peristiwa al-Dukhan terhadap kaum Quraisy kerana menolak dakwah Rasulullah SAW
- Allah SWT memberikan pembalasan terhadap golongan yang menentang agama-Nya setelah diutuskan rasul kepada mereka', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20011, 'Akidah', 'Soalan 2 (a)', 3, 'Seorang murid sering membuli rakannya di sekolah kerana merasakan dirinya kuat dan berpengaruh.

Bagaimanakah penghayatan terhadap sifat al-Muntaqim dapat mengatasi masalah di atas?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Murid akan takut melakukan kezaliman terhadap orang lain
- Murid akan lebih menjaga akhlak dan tingkah laku
- Remaja akan lebih berhati-hati dalam perbuatan
- Remaja terdorong untuk memperbanyakkan amalan soleh
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20012, 'Akidah', 'Soalan 2 (a)', 4, 'Ramalkan kemungkinan yang akan berlaku sekiranya masalah di atas tidak dibendung.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Hilang keyakinan diri
- Mangsa akan mengalami tekanan emosi
- Ramai murid akan berasa takut untuk hadir ke sekolah
- Pembuli tidak merasa bersalah dengan perbuatan yang dilakukan
- Berpotensi terlibat dengan jenayah yang lebih besar
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20013, 'Akidah', 'Soalan 2 (b)', 1, 'Nyatakan sejarah ringkas kemunculan aliran Khawarij.', 2, 'Kumpulan pengikut Saidina Ali r.a. yang berpaling tadah (1m) kerana tidak berpuas hati dengan keputusan Majlis Tahkim (1m).', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20014, 'Akidah', 'Soalan 2 (b)', 2, 'Jelaskan dua prinsip utama aliran Khawarij yang bertentangan dengan akidah Ahli Sunnah Wal Jamaah.', 2, 'Mana-mana dua (2 isi × 1m):
- Jawatan khalifah atau imam hendaklah diserahkan pemilihannya kepada rakyat untuk memilih sesiapa sahaja kaum muslimin yang layak
- Menyatakan Saidina Ali r.a. telah melakukan dosa besar serta kufur kerana bersetuju mengadakan Majlis Tahkim
- Wajib keluar menentang pemimpin atau khalifah yang tidak adil
- Beriktikad bahawa orang yang melakukan maksiat dikira berdosa besar dan kafir', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20015, 'Akidah', 'Soalan 2 (b)', 3, '[Rangsangan: poster "Awas!!! Fahaman Aliran Khawarij" — golongan Khawarij memahami agama secara keras tanpa mengambil kira hikmah, rahmat dan toleransi.]

Mengapakah masih terdapat umat Islam yang terpengaruh dengan fahaman di atas?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Keimanan yang lemah dalam diri (1m) kerana kurang mendalami ilmu agama (1m)
- Pengaruh rakan sebaya yang sesat (1m) kerana fanatik terhadap pengasas aliran sesat (1m)
- Ingin mencuba perkara baru (1m) sehingga menyimpang daripada ajaran yang sebenar (1m)
- Mudah percaya kepada fahaman baharu (1m) tanpa merujuk akidah yang benar (1m)
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20016, 'Akidah', 'Soalan 2 (b)', 4, 'Pada pendapat anda, adakah penguatkuasaan undang-undang sahaja sudah memadai untuk mengatasi fahaman di atas? Huraikan jawapan anda.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
Ya, melalui undang-undang dapat:
- Memberi hukuman yang berat kepada individu / kumpulan yang menyebarkan fahaman yang salah
- Mengawal penyebaran fahaman daripada berleluasa
- Menimbulkan rasa takut dikenakan hukuman yang berat
Tidak, selain daripada penguatkuasaan undang-undang:
- Mengadakan kempen / forum / ceramah tentang kesedaran akidah
- Peranan masyarakat memberi teguran dan nasihat
- Penyebaran keburukan fahaman melalui media sosial
- Pemerkasaan kurikulum pendidikan berkaitan ilmu akidah
- Penerapan akidah Ahli Sunnah Wal Jamaah sejak kecil
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20017, 'Fiqah', 'Soalan 3 (a)', 1, 'Amalan mewakafkan harta merupakan amalan yang amat dituntut dalam Islam.

Apakah maksud wakaf?', 2, 'Mewakafkan harta yang dapat diambil manfaatnya serta kekal fizikal (ainnya) (1m) untuk penggunaan yang baik serta bertujuan mendapat keredaan Allah (1m).', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20018, 'Fiqah', 'Soalan 3 (a)', 2, 'Nyatakan dua contoh wakaf.', 2, 'Mana-mana dua (2 isi × 1m):
- Mewakafkan rumah untuk pusat penjagaan anak yatim
- Mewakafkan bangunan untuk dijadikan pusat pendidikan
- Mewakafkan tanah untuk dibina masjid
- Mewakafkan telaga untuk digunakan air bersih
- Mewakafkan kenderaan kepada masjid untuk kegunaan urusan kebajikan
- Mewakafkan wang tunai bagi tujuan pembelian van jenazah
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20019, 'Fiqah', 'Soalan 3 (a)', 3, '[Rangsangan: kartun dua lelaki berbual — "Wakaf sudah mula diamalkan secara meluas di negara kita." "Betul, saya setuju pendapat awak."]

Pada pendapat anda, bagaimanakah amalan di atas dapat meningkatkan ekonomi umat Islam di negara kita?', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Tanah wakaf dapat dimajukan sebagai pusat perniagaan
- Dapat menambah baik infrastruktur kebajikan / perniagaan
- Dapat membantu golongan miskin dengan menyediakan medan niaga / kenderaan
- Dapat mengurangkan kos sara hidup golongan miskin
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20020, 'Fiqah', 'Soalan 3 (b)', 1, 'Jelaskan dua tanggungjawab isteri.', 2, 'Mana-mana dua (2 isi × 1m):
- Mentaati perintah suami selagi tidak bertentangan dengan hukum syarak
- Menjaga kehormatan diri dengan berpakaian menutup aurat, memelihara pandangan dan menjaga batas pergaulan ketika berada di luar rumah
- Menjaga kemuliaan, maruah dan harta suami
- Melakukan perkara yang menyenangkan hati suami
- Mendapat keizinan suami sebelum keluar rumah (tambahan tulisan tangan dalam skema asal)
Catatan: Jawapan hendaklah ditulis dalam ayat yang lengkap.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20021, 'Fiqah', 'Soalan 3 (b)', 2, 'Antara tanggungjawab suami dan isteri terhadap anak-anak ialah menerapkan pendidikan akidah Islam yang betul sejak daripada kecil.

Jelaskan kepentingan pendidikan di atas ke arah pembentukan generasi unggul.', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan jawapan (isi 1m + huraian 1m):
- Mampu menjadi pedoman yang teguh sepanjang hayat agar mempunyai akidah yang jitu
- Mengelakkan daripada mudah terpengaruh dengan fahaman dan ideologi yang bertentangan dengan Islam agar dapat berpegang dengan akidah yang benar
- Memelihara iman seorang muslim agar sentiasa yakin dengan ketentuan Allah SWT
- Menjadi asas penerimaan ibadah kerana bertepatan dengan al-Quran dan al-Sunnah sebagai rujukan
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20022, 'Fiqah', 'Soalan 3 (b)', 3, 'Huraikan kesan kepada institusi keluarga sekiranya tanggungjawab di atas diabaikan.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Gaya hidup keluarga berkiblatkan Barat dan hedonisme
- Ahli keluarga kurang rasa tanggungjawab dan kasih sayang
- Hilang panduan dalam menentukan hala tuju hidup keluarga
- Berlaku perpecahan dalam keluarga kerana berlainan fahaman
- Syariat Islam tidak dapat diamalkan sebaiknya dalam keluarga
- Sesebuah keluarga akan dipandang serong oleh masyarakat
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20023, 'Fiqah', 'Soalan 3 (c)', 1, 'Jelaskan hukum dan alasan bagi situasi berikut:
(a) Suami melafazkan talak kepada isterinya yang dalam keadaan haid.', 2, 'Terima mana-mana:
- Hukum: Haram. Alasan: menceraikan isteri ketika dalam haid adalah dilarang.
- Hukum: Sah. Alasan: talak adalah hak suami / talak dilafazkan kepada isterinya yang sah.
Pemarkahan: hukum betul + alasan betul = 2m; hukum betul + alasan salah = 1m; hukum salah = 0m.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20024, 'Fiqah', 'Soalan 3 (c)', 2, 'Jelaskan hukum dan alasan bagi situasi berikut:
(b) Abu kembali rujuk bekas isterinya yang diceraikan dengan talak tiga.', 2, 'Hukum: Tidak sah. Alasan: perceraian dengan talak tiga tiada rujuk.
Pemarkahan: hukum betul + alasan betul = 2m; hukum betul + alasan salah = 1m; hukum salah = 0m.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20025, 'Sirah', 'Soalan 4 (a)', 1, 'Nyatakan dua pusat pemerintahan kerajaan Uthmaniyah.', 2, 'Mana-mana dua (2 isi × 1m):
- Sogut
- Bursa
- Edirne
- Istanbul', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20026, 'Sirah', 'Soalan 4 (a)', 2, 'Terangkan dua faktor kegemilangan kerajaan Uthmaniyah daripada aspek sosial.', 4, 'Mana-mana dua (2 × [isi 1m + huraian 1m]):
- Penjagaan kebajikan rakyat (1m) menerusi bantuan kepada golongan yang memerlukan (1m)
- Mewujudkan suasana harmoni (1m) dalam masyarakat (1m)
- Sistem wakaf yang sistematik (1m) meliputi aspek keperluan asas, pendidikan dan kesihatan (1m)', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20027, 'Sirah', 'Soalan 4 (a)', 3, '[Jadual: Pemerintah terkenal kerajaan Uthmaniyah — Uthman bin Ertughrul; Murad I bin Urkhan; Muhammad al-Fateh bin Murad II; Sulaiman al-Qanuni bin Salim I.]

Pada pandangan anda, apakah cabaran untuk membina generasi masa kini yang hebat sebagaimana tokoh di atas? Huraikan.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Penggunaan gajet yang melampaui batas
- Lebih gemar memberi tumpuan kepada aktiviti hiburan yang melalaikan
- Kurang memberi tumpuan terhadap membina potensi diri
- Kurang cakna terhadap kehebatan tokoh Islam terdahulu
- Pengaruh budaya Barat yang negatif / hedonisme
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20028, 'Sirah', 'Soalan 4 (b)', 1, 'Kerajaan Khulafa al-Rasyidin ialah contoh kepimpinan terbaik sepanjang zaman.

Senaraikan dua ciri kepimpinan Saidina Ali bin Abi Talib.', 2, 'Mana-mana dua (2 isi × 1m):
- Tegas
- Berpandangan jauh
- Berilmu
- Berani', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20029, 'Sirah', 'Soalan 4 (b)', 2, 'Jelaskan dua pencapaian pemerintahan kerajaan Khulafa al-Rasyidin dalam bidang agama.', 4, '2 isi × 2m:
- Khalifah Abu Bakar al-Siddiq berjaya memerangi golongan murtad, nabi palsu dan golongan yang enggan membayar zakat
- Khalifah Umar bin al-Khattab menyebarkan dakwah Islam sehingga tersebar di wilayah Mesir, Parsi dan Rom', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20030, 'Sirah', 'Soalan 4 (b)', 3, 'Usaha mengumpul, menulis dan membukukan al-Quran giat dijalankan pada zaman pemerintahan Khulafa al-Rasyidin membuktikan keprihatinan khalifah dalam memelihara al-Quran.

Bagaimanakah usaha Khulafa al-Rasyidin di atas mampu diteruskan oleh generasi hari ini?', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Mencetak naskhah al-Quran secara konsisten bagi menggantikan naskhah al-Quran yang lama
- Mempelajari / menghafaz / mengamalkan ajaran al-Quran dalam kehidupan seharian
- Menyebarkan ilmu al-Quran melalui pelbagai medium seperti kelas pengajian, media sosial dan program dakwah
- Mengadakan kempen mencintai al-Quran / program Quran Hour
- Memberi pengiktirafan kepada institusi tahfiz
- Memberi pendidikan al-Quran kepada anak sejak kecil
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20031, 'Akhlak', 'Soalan 5 (a)', 1, 'Sifat tawaduk dapat menzahirkan kesucian jiwa.

Nyatakan maksud tawaduk.', 2, 'Sikap kerendahan hati (1m) kepada Allah SWT dan sesama manusia (1m).', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20032, 'Akhlak', 'Soalan 5 (a)', 2, 'Jelaskan dua sifat tawaduk Rasulullah SAW ketika makan dan minum.', 2, 'Mana-mana dua (2 isi × 1m):
- Baginda tidak pernah mencela makanan yang disediakan
- Jika menyukai makanan tersebut, baginda akan memakannya
- Baginda akan meninggalkan makanan yang baginda tidak suka
- Baginda tidak menzahirkan perasaan, sebaliknya berdiam', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20033, 'Akhlak', 'Soalan 5 (a)', 3, 'Kejayaan yang dikecapi oleh seseorang boleh menyebabkan seseorang itu menjadi lupa diri dan sombong.

Apakah kesan sekiranya situasi di atas wujud pada individu muslim?', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan isi:
- Dipandang rendah dan dibenci oleh masyarakat
- Menjadi lalai serta lupa untuk bersyukur
- Menjejaskan hubungan silaturahim
- Sukar menerima nasihat dan teguran daripada orang lain
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20034, 'Akhlak', 'Soalan 5 (a)', 4, 'Bagaimanakah sifat tawaduk dapat mengelakkan situasi di atas? Huraikan.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Menyedari bahawa kejayaan yang diperoleh adalah kurniaan Allah SWT
- Sentiasa bersyukur atas kejayaan
- Sentiasa muhasabah kelebihan dan kelemahan diri
- Menjadikan kejayaan sebagai pembakar semangat untuk membantu orang lain
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20035, 'Akhlak', 'Soalan 5 (b)', 1, 'Jelaskan dua adab terhadap orang sakit daripada aspek fizikal.', 2, '2 isi × 1m:
- Memastikan tempat dan tubuh badan pesakit sentiasa bersih
- Menyediakan keperluan dan kemudahan asas untuk pesakit', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20036, 'Akhlak', 'Soalan 5 (b)', 2, 'Terangkan hikmah beradab terhadap orang sakit.', 2, 'Mana-mana satu (isi 1m + huraian 1m = 2m):
- Menggembirakan pesakit (1m) agar hatinya tenang dalam menempuh ujian Allah SWT (1m)
- Mengeratkan ukhuwah sesama anggota masyarakat (1m) agar hidup perpaduan dapat dibentuk (1m)
- Melahirkan keinsafan (1m) kerana diberikan nikmat kesihatan setelah melihat penderitaan pesakit (1m)', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20037, 'Akhlak', 'Soalan 5 (b)', 3, '[Rangsangan: gambar di wad hospital — Individu A (pelawat) mengajak Individu B (pesakit) berswafoto: "Jom kita selfie, saya nak masuk dalam Instagram", manakala B menutup muka: "Eh, malu la saya... janganlah."]

Berdasarkan gambar di atas, kaitkan tindakan individu A dengan adab terhadap orang sakit.', 2, 'Rubrik 2m: 1m isi sahaja; 2m isi + huraian ringkas.
Cadangan jawapan (isi 1m + huraian 1m):
- Individu A tidak menjaga ketenteraman emosi pesakit kerana tindakannya boleh menyebabkan pesakit berasa tertekan dan terganggu
- Individu A tidak menjaga perasaan pesakit kerana memaksa rakannya berswafoto walaupun pesakit berasa malu dan tidak selesa
- Individu A tidak menghormati privasi pesakit kerana memuat naik gambar rakannya ke media sosial tanpa keizinan
- Individu A tidak menunjukkan sikap prihatin terhadap pesakit kerana lebih mementingkan perkongsian di media sosial berbanding keselesaan rakannya yang sedang sakit
- Individu A tidak menjaga adab ketika menziarahi orang sakit kerana tindakannya boleh mengaibkan pesakit apabila gambar tersebut dilihat oleh orang ramai
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026'),
(20038, 'Akhlak', 'Soalan 5 (b)', 4, 'Sebagai seorang rakan, apakah yang perlu anda lakukan agar tindakan individu A memenuhi tuntutan adab terhadap orang sakit? Huraikan.', 4, 'Rubrik 4m: 1m satu isi sahaja; 2m isi + huraian ringkas; 3m huraian lengkap dengan contoh/sebab/akibat/kesan/dalil; 4m huraian lengkap dengan kesimpulan/olahan tepat, jelas, relevan dan menarik.
Cadangan isi:
- Menasihatinya supaya meminta keizinan pesakit terlebih dahulu sebelum mengambil atau memuat naik gambar di media sosial
- Menegurnya agar menjaga perasaan pesakit dan tidak memaksa pesakit berswafoto ketika berada dalam keadaan tidak selesa
- Menerangkan kepadanya bahawa menjaga privasi pesakit merupakan salah satu tuntutan adab terhadap orang sakit dalam Islam
- Mengajaknya supaya memberikan kata-kata semangat dan doa kepada pesakit berbanding menjadikan lawatan tersebut sebagai kandungan media sosial
- Mengingatkannya agar menziarahi pesakit dengan ikhlas
- Menyedarkannya agar mengelakkan perbuatan yang boleh mengganggu emosi dan ketenteraman pesakit
Catatan: Mana-mana jawapan yang munasabah diterima.', ARRAY['SBP']::text[], 'Percubaan 2026')
ON CONFLICT (no_asal) DO UPDATE SET
  bidang = EXCLUDED.bidang, bahagian = EXCLUDED.bahagian, no_soalan = EXCLUDED.no_soalan,
  soalan = EXCLUDED.soalan, markah = EXCLUDED.markah, skema_jawapan = EXCLUDED.skema_jawapan,
  sumber = EXCLUDED.sumber, tag = EXCLUDED.tag;
