# JanaPAI

Aplikasi web progresif (PWA) dalam **tulisan Jawi** untuk panitia Pendidikan Islam:

- **Jana Soalan KSSM (Tingkatan 1-5)**: soalan objektif atau subjektif, aras Rendah, Sederhana, Tinggi atau KBAT, lengkap dengan skema jawapan. Guru boleh pratonton dan menyunting soalan sebelum menyimpannya ke bank soalan.
- **Jana RPT**: menyusun tajuk DSKP yang belum diajar mengikut takwim persekolahan (Kumpulan A/B), dengan catatan aktiviti, PAK21, EMK dan PBD.
- **Bank Soalan**: tapis, salin, cetak (dengan atau tanpa skema) dan padam soalan.

Teknologi yang digunakan: Supabase (PostgreSQL dan Edge Functions), Google Gemini (`@google/genai`), Alpine.js dan Tailwind CSS v4. Frontend tidak memerlukan langkah build.

## Seni bina

```
Pelayar (PWA)                              Supabase
─────────────                              ────────
index.html + Alpine ──POST + token──► Edge Functions ──service role──► PostgreSQL
                       panitia          masuk · data                    (RLS: tiada akses
                                        jana-soalan · jana-rpt           untuk anon)
                                              │
                                              └──► Gemini API (GEMINI_API_KEY hanya di sini)
```

- **Kata laluan panitia, tiada akaun.** Function `masuk` menyemak `KATA_LALUAN_PANITIA` dan mengeluarkan token 30 hari. Semua function lain menolak permintaan tanpa token yang sah. Kunci token diterbitkan daripada service role key + kata laluan, jadi **menukar kata laluan membatalkan semua token lama serta-merta**.
- **Pelayar tidak menyentuh pangkalan data.** RLS diaktifkan tanpa polisi, jadi kunci anon tidak boleh membaca atau menulis apa-apa. Semua data melalui function `data`, yang hanya membenarkan senarai operasi tetap dan mengesahkan setiap parameter.
- RPT dan Bank Soalan **dikongsi oleh semua ahli panitia**.
- Output Gemini dikunci dengan JSON Schema (`responseJsonSchema`), kemudian **disahkan semula** di server. Dalam RPT, tajuk diberi rujukan `T1`, `T2` dan seterusnya (bukan UUID), jadi model tidak boleh mereka ID. Minggu cuti juga tidak boleh diberi tajuk.
- Panitia dihadkan kepada `HAD_JANA_SEJAM` penjanaan sejam (lalai 60) untuk mengawal kos Gemini.

## Struktur fail

```
supabase/
  config.toml                               verify_jwt = false (functions semak token sendiri)
  migrations/20260924000000_init_janapai.sql  skema penuh + RLS + fungsi simpan_rpt
  seed.sql                                  DSKP Tingkatan 1 (Jawi) + takwim CONTOH
  functions/
    _shared/http.ts      CORS, POST, token panitia, validasi input, format ralat
    _shared/token.ts     token panitia (HMAC) & semakan kata laluan
    _shared/db.ts        klien service role, had penjanaan, log
    _shared/gemini.ts    janaSoalanAI() & janaRptAI() (prompt Jawi, schema, validasi)
    masuk/  data/  jana-soalan/  jana-rpt/
web/
  index.html  manifest.json  sw.js  icons/
  js/config.js   URL projek Supabase
  js/backend.js  token panitia + panggilan Edge Functions
  js/api.js      getDskp, simpanSoalan, getTakwim, simpanRpt, janaSoalan, janaRpt …
  js/app.js      komponen Alpine (UI)
```

## Persediaan

Projek: `dgwzprjwqhmqkqkemjeb` (URL sudah diisi dalam `web/js/config.js`).

### 1. Pangkalan data

Pilih salah satu:

- **SQL Editor** (paling mudah): dalam Supabase Dashboard › **SQL Editor**, tampal dan jalankan `supabase/migrations/20260924000000_init_janapai.sql`, kemudian `supabase/seed.sql`.
- **CLI**: `npx supabase login`, `npx supabase link --project-ref dgwzprjwqhmqkqkemjeb`, kemudian `npm run db:push` dan jalankan `supabase/seed.sql` di SQL Editor.

DSKP Tingkatan 1 dalam seed disalin daripada dokumen rasmi BPK; **semak sebelum digunakan**. Takwim dalam seed hanyalah **contoh**: ubah tarikh dan tandakan minggu cuti (`minggu_pdp = false`).

### 2. Rahsia Edge Functions

Dalam Dashboard › **Edge Functions › Secrets**, tambah:

| Nama | Keterangan |
| --- | --- |
| `GEMINI_API_KEY` | Dari [Google AI Studio](https://aistudio.google.com/apikey) |
| `KATA_LALUAN_PANITIA` | Kata laluan bersama panitia |
| `GEMINI_MODEL` | Pilihan, lalai `gemini-3.5-flash` |
| `HAD_JANA_SEJAM` | Pilihan, lalai `60` |

Atau salin `supabase/functions/.env.example` ke `supabase/functions/.env`, isi, dan jalankan `npm run secrets:set`.

### 3. Deploy Edge Functions

```bash
npx supabase login
npx supabase link --project-ref dgwzprjwqhmqkqkemjeb
npm run functions:deploy
```

`config.toml` mematikan semakan JWT gateway (`verify_jwt = false`) kerana functions mengesahkan token panitia sendiri.

### 4. Frontend PWA

Folder `web/` di-deploy ke Vercel (`vercel.json`) dan GitHub Pages (`.github/workflows/pages.yml`). PWA memerlukan HTTPS (kecuali `localhost`). Untuk ujian tempatan: `npm run dev:web` (http://localhost:5173).

### Arahan lain

| Arahan | Fungsi |
| --- | --- |
| `npm run check` | Semak jenis Edge Functions (Deno) |
| `npm run icons` | Jana semula ikon PWA |

## Nota kandungan

- Soalan dijana oleh AI. **Guru mesti menyemak** ketepatan fakta, ayat al-Quran, hadis dan hukum sebelum menggunakannya. Prompt sistem melarang model mereka nas, tetapi semakan manusia tetap wajib.
- Setiap kali fail dalam `web/` diubah, naikkan `VERSION` dalam `web/sw.js` supaya pengguna menerima versi terbaru.
