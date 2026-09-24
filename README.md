# JanaPAI

Aplikasi web progresif (PWA) untuk guru Pendidikan Islam:

- **Jana Soalan KSSM (Tingkatan 1-5)**: soalan objektif atau subjektif, aras Rendah, Sederhana, Tinggi atau KBAT, lengkap dengan skema jawapan. Guru boleh pratonton dan menyunting soalan sebelum menyimpannya ke bank soalan.
- **Jana RPT**: menyusun tajuk DSKP yang belum diajar mengikut takwim persekolahan (Kumpulan A/B), dengan catatan aktiviti, PAK21, EMK dan PBD.
- **Bank Soalan**: tapis, salin, cetak (dengan atau tanpa skema) dan padam soalan.

Teknologi yang digunakan: Nhost (PostgreSQL, Hasura GraphQL, Auth dan Functions), Google Gemini (`@google/genai`), Alpine.js dan Tailwind CSS v4. Frontend tidak memerlukan langkah build.

## Seni bina

```
Pelayar (PWA)                        Nhost
─────────────                        ─────
index.html + Alpine ──GraphQL──────► Hasura ──► PostgreSQL
   │   (JWT pengguna)                  ▲  permissions role `user`
   │                                   │  (token pengguna)
   └──POST /jana-soalan, /jana-rpt──► Functions ──► Gemini API
                                         (GEMINI_API_KEY hanya di sini)
```

- Kunci Gemini **tidak pernah** dihantar ke pelayar. Functions memanggil Hasura dengan **token pengguna** (bukan admin secret). Oleh itu kebenaran Hasura tetap terpakai, JWT disahkan sebelum sebarang kos AI, dan `user_id` pada log diisi secara automatik.
- Output Gemini dikunci dengan JSON Schema (`responseJsonSchema`), kemudian **disahkan semula** di server. Soalan yang pilihannya tidak lengkap dibuang. Dalam RPT, tajuk diberi rujukan `T1`, `T2` dan seterusnya (bukan UUID), jadi model tidak boleh mereka ID. Minggu cuti juga tidak boleh diberi tajuk.
- Setiap pengguna dihadkan kepada `HAD_JANA_SEJAM` penjanaan sejam (lalai 30) untuk mengawal kos.

## Struktur fail

```
nhost/migrations/default/…_init_janapai/   up.sql / down.sql  (skema penuh)
nhost/seeds/default/001_contoh_data.sql     data CONTOH (DSKP + takwim dijana)
scripts/setup-hasura.mjs                    track jadual, hubungan & permissions
scripts/make-icons.mjs                      jana ikon PWA
functions/
  _lib/gemini.ts     modul Gemini: janaSoalanAI() & janaRptAI() (prompt, schema, validasi)
  _lib/hasura.ts     GraphQL dengan token pengguna, had penjanaan, log
  _lib/http.ts       CORS, POST sahaja, validasi input, format ralat
  jana-soalan.ts     POST /v1/functions/jana-soalan
  jana-rpt.ts        POST /v1/functions/jana-rpt
web/
  index.html  manifest.json  sw.js  icons/
  js/config.js   subdomain & region Nhost
  js/nhost.js    createClient + auth + gql() + callFunction()
  js/api.js      getDskp, simpanSoalan, getTakwim, simpanRpt, janaSoalan, janaRpt …
  js/app.js      komponen Alpine (UI)
```

## Persediaan

### 1. Projek Nhost

1. Cipta projek di [app.nhost.io](https://app.nhost.io) dan catat **subdomain**, **region** dan **admin secret**.
2. **Skema:** buka Hasura Console, pergi ke **Data › SQL**, tampal `nhost/migrations/default/1758700000000_init_janapai/up.sql`, dan tandakan *This is a migration*. Jika menggunakan Nhost CLI dan GitHub, folder `nhost/migrations` akan di-apply secara automatik.
3. **Metadata & permissions:**
   ```bash
   NHOST_SUBDOMAIN=xxxx NHOST_REGION=ap-southeast-1 NHOST_ADMIN_SECRET=... npm run setup:hasura
   ```
4. **Data:** isikan jadual `dskp` dengan kandungan DSKP Pendidikan Islam KSSM rasmi, dan jadual `takwim_persekolahan` dengan takwim KPM. Anda boleh bermula dengan `nhost/seeds/default/001_contoh_data.sql`. Semua data dalam fail itu hanyalah **contoh**, jadi sila ubah tarikh dan tandakan minggu cuti (`minggu_pdp = false`).

### 2. Kunci Gemini dan Functions

1. Dapatkan kunci di [Google AI Studio](https://aistudio.google.com/apikey).
2. Dalam Nhost Dashboard, pergi ke **Settings › Secrets** dan tambah `GEMINI_API_KEY`.
3. Tambah pemboleh ubah persekitaran untuk functions dalam `nhost/nhost.toml`:
   ```toml
   [[global.environment]]
   name = 'GEMINI_API_KEY'
   value = '{{ secrets.GEMINI_API_KEY }}'

   # Pilihan:
   [[global.environment]]
   name = 'GEMINI_MODEL'        # lalai: gemini-2.5-flash
   value = 'gemini-2.5-flash'

   [[global.environment]]
   name = 'HAD_JANA_SEJAM'      # lalai: 30
   value = '30'
   ```
4. Sambungkan repo ini ke projek Nhost melalui GitHub integration. Folder `functions/` akan di-deploy dan kebergantungannya (`@google/genai`) diambil dari `package.json` di root.
5. Penjanaan RPT untuk setahun penuh boleh mengambil masa 20-60 saat. Pastikan had masa (timeout) functions pada pelan Nhost anda mencukupi.

### 3. Frontend PWA

1. Isikan `web/js/config.js` dengan `subdomain` dan `region` projek anda.
2. Jalankan secara tempatan:
   ```bash
   npm install
   npm run dev:web        # http://localhost:5173
   ```
3. Untuk deploy, muat naik folder `web/` ke mana-mana hos statik HTTPS seperti Netlify, Vercel, Cloudflare Pages atau GitHub Pages. PWA memerlukan HTTPS (kecuali `localhost`).
4. Dalam Nhost Dashboard, pergi ke **Settings › Authentication** dan tambah URL frontend anda ke *Allowed Redirect URLs* / *Client URL*.

### Arahan lain

| Arahan | Fungsi |
| --- | --- |
| `npm run typecheck` | Semak jenis TypeScript untuk functions |
| `npm run icons` | Jana semula ikon PWA |
| `npm run setup:hasura` | Apply metadata Hasura (selamat diulang) |

## Nota kandungan

- Soalan dijana oleh AI. **Guru mesti menyemak** ketepatan fakta, ayat al-Quran, hadis dan hukum sebelum menggunakannya. Prompt sistem melarang model mereka nas, tetapi semakan manusia tetap wajib.
- Setiap kali fail dalam `web/` diubah, naikkan `VERSION` dalam `web/sw.js` supaya pengguna menerima versi terbaru.
