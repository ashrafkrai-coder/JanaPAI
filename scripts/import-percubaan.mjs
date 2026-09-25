// Jana supabase/seed_percubaan.sql daripada spreadsheet "HIMPUNAN Soalan Percubaan + Ramalan PI SPM".
// Guna: npm run percubaan   (spreadsheet mesti dikongsi "Sesiapa yang mempunyai pautan – Pelihat")
//       node scripts/import-percubaan.mjs fail.csv   (daripada CSV yang dimuat turun sendiri)
// Kemudian jalankan SQL itu di Supabase Dashboard > SQL Editor. Teks kekal Rumi seperti sumber.
import { readFile, writeFile } from 'node:fs/promises';

const SHEET_ID = '1D_EXLhtFEgcC7gB5xb6p40WZ7-kxOHkRo2aaPN3fBdM';
const GID = '1014912970';
const OUT = new URL('../supabase/seed_percubaan.sql', import.meta.url);
const BIDANG = ['Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak'];
// Kod sumber tidak seragam dalam spreadsheet -> kod piawai (disahkan oleh panitia).
const ALIAS_SUMBER = { S: 'SBH' };

async function ambilCsv() {
  if (process.argv[2]) return readFile(process.argv[2], 'utf8');
  const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`);
  if (!res.ok || !res.headers.get('content-type')?.includes('text/csv')) {
    throw new Error(`Gagal muat turun spreadsheet (HTTP ${res.status}). Pastikan ia dikongsi melalui pautan.`);
  }
  return res.text();
}

// Pengurai CSV RFC 4180 ringkas (medan berpetik, "" dalam petikan, baris baru dalam medan).
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// U+FFFD dalam sumber menggantikan tanda sempang panjang yang hilang semasa eksport.
const bersih = (s) => s.replace(/\s*�\s*/g, ' — ').replace(/[ \t]+/g, ' ').trim();
const sql = (s) => (s == null || s === '' ? 'NULL' : `'${s.replaceAll("'", "''")}'`);
const int = (s) => (/^\d+$/.test(s.trim()) ? Number(s) : null);

const [header, ...data] = parseCsv(await ambilCsv()).filter((r) => r.some((c) => c.trim()));
if (header[0]?.trim() !== 'SOALAN' || header.length < 9) throw new Error(`Lajur tidak dijangka: ${header.join(' | ')}`);

const baris = data.map((r, i) => {
  const [no, bidang, bahagian, noSoalan, soalan, markah, skema, sumber, tag] = r.map(bersih);
  if (!int(no) || !BIDANG.includes(bidang) || !soalan || !skema) {
    throw new Error(`Baris ${i + 2} tidak sah: ${r.join(' | ')}`);
  }
  const kod = [...new Set(sumber.split(',').map((s) => s.trim()).filter(Boolean).map((s) => ALIAS_SUMBER[s] ?? s))];
  const arr = `ARRAY[${kod.map(sql).join(', ')}]::text[]`;
  return `(${int(no)}, ${sql(bidang)}, ${sql(bahagian)}, ${int(noSoalan) ?? 'NULL'}, ${sql(soalan)}, ${int(markah) ?? 'NULL'}, ${sql(skema)}, ${arr}, ${sql(tag)})`;
});

const out = `-- Dijana oleh scripts/import-percubaan.mjs pada ${new Date().toISOString().slice(0, 10)} — JANGAN sunting dengan tangan.
-- Sumber: https://docs.google.com/spreadsheets/d/${SHEET_ID} (${baris.length} soalan)
DELETE FROM public.soalan_percubaan
WHERE no_asal NOT IN (${data.map((r) => int(r[0])).join(', ')});

INSERT INTO public.soalan_percubaan (no_asal, bidang, bahagian, no_soalan, soalan, markah, skema_jawapan, sumber, tag) VALUES
${baris.join(',\n')}
ON CONFLICT (no_asal) DO UPDATE SET
  bidang = EXCLUDED.bidang, bahagian = EXCLUDED.bahagian, no_soalan = EXCLUDED.no_soalan,
  soalan = EXCLUDED.soalan, markah = EXCLUDED.markah, skema_jawapan = EXCLUDED.skema_jawapan,
  sumber = EXCLUDED.sumber, tag = EXCLUDED.tag;
`;
await writeFile(OUT, out, 'utf8');
console.log(`${baris.length} soalan -> supabase/seed_percubaan.sql`);
