// POST /functions/v1/data
// Body: { op, ...parameter }
// Satu-satunya laluan data untuk pelayar (RLS menutup semua akses terus). Hanya operasi dalam
// senarai OPS dibenarkan, dan setiap parameter disahkan di sini kerana service role memintas RLS.
import { db, semak } from '../_shared/db.ts';
import { HttpError, intInRange, oneOf, postHandler, teks, uuid } from '../_shared/http.ts';

const BIDANG = ['Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak'] as const;
const ARAS = ['Rendah', 'Sederhana', 'Tinggi', 'KBAT'] as const;
const JENIS = ['Objektif', 'Subjektif'] as const;
const TARIKH_RE = /^\d{4}-\d{2}-\d{2}$/;

const pilihan = <T>(v: unknown, fn: (v: unknown) => T): T | null => (v == null || v === '' ? null : fn(v));
const tarikh = (v: unknown, name: string) => {
  if (typeof v !== 'string' || !TARIKH_RE.test(v)) throw new HttpError(400, `${name} تيدق صح.`);
  return v;
};

type Body = Record<string, unknown>;

const OPS: Record<string, (b: Body) => Promise<unknown>> = {
  // --- DSKP & takwim ---------------------------------------------------------
  async getDskp(b) {
    let q = db().from('dskp')
      .select('id, tingkatan, bidang, urutan, tajuk, standard_kandungan, standard_pembelajaran, standard_prestasi, objektif_pembelajaran')
      .eq('tingkatan', intInRange(b.tingkatan, 1, 5, 'tingkatan'));
    const bidang = pilihan(b.bidang, (v) => oneOf(v, BIDANG, 'bidang'));
    if (bidang) q = q.eq('bidang', bidang);
    return semak(await q.order('urutan').order('bidang').order('tajuk'));
  },

  async getTakwim(b) {
    return semak(await db().from('takwim_persekolahan')
      .select('id, minggu_ke, tarikh_mula, tarikh_tamat, minggu_pdp, catatan')
      .eq('tahun', intInRange(b.tahun, 2020, 2100, 'tahun'))
      .eq('kumpulan', oneOf(b.kumpulan, ['A', 'B'] as const, 'kumpulan'))
      .order('minggu_ke'));
  },

  // --- RPT -------------------------------------------------------------------
  async getRpt(b) {
    return semak(await db().from('rpt')
      .select('id, minggu_ke, tarikh_mula, tarikh_tamat, tajuk_id, catatan_aktiviti, dskp(tajuk, bidang)')
      .eq('tahun', intInRange(b.tahun, 2020, 2100, 'tahun'))
      .eq('tingkatan', intInRange(b.tingkatan, 1, 5, 'tingkatan'))
      .order('minggu_ke').order('created_at'));
  },

  async simpanRpt(b) {
    if (!Array.isArray(b.minggu) || b.minggu.length > 300) throw new HttpError(400, 'minggu تيدق صح.');
    const baris = b.minggu.map((m: Body, i: number) => ({
      minggu_ke: intInRange(m.minggu_ke, 1, 53, `minggu[${i}].minggu_ke`),
      tarikh_mula: tarikh(m.tarikh_mula, `minggu[${i}].tarikh_mula`),
      tarikh_tamat: tarikh(m.tarikh_tamat, `minggu[${i}].tarikh_tamat`),
      tajuk_id: pilihan(m.tajuk_id, (v) => uuid(v, `minggu[${i}].tajuk_id`)),
      catatan_aktiviti: typeof m.catatan_aktiviti === 'string' ? m.catatan_aktiviti.slice(0, 2000) : null,
    }));
    return semak(await db().rpc('simpan_rpt', {
      p_tahun: intInRange(b.tahun, 2020, 2100, 'tahun'),
      p_tingkatan: intInRange(b.tingkatan, 1, 5, 'tingkatan'),
      p_dari: intInRange(b.dariMinggu ?? 1, 1, 53, 'dariMinggu'),
      p_baris: baris,
    }));
  },

  // --- Bank soalan -----------------------------------------------------------
  async simpanSoalan(b) {
    if (!Array.isArray(b.rows) || !b.rows.length || b.rows.length > 50) throw new HttpError(400, 'rows تيدق صح.');
    const rows = b.rows.map((r: Body, i: number) => ({
      dskp_id: pilihan(r.dskp_id, (v) => uuid(v, `rows[${i}].dskp_id`)),
      tingkatan: intInRange(r.tingkatan, 1, 5, `rows[${i}].tingkatan`),
      bidang: oneOf(r.bidang, BIDANG, `rows[${i}].bidang`),
      tajuk: teks(r.tajuk, 255, `rows[${i}].tajuk`),
      aras_kognitif: oneOf(r.aras_kognitif, ARAS, `rows[${i}].aras_kognitif`),
      jenis_soalan: oneOf(r.jenis_soalan, JENIS, `rows[${i}].jenis_soalan`),
      soalan: teks(r.soalan, 10000, `rows[${i}].soalan`),
      // Bentuk A-D disemak oleh kekangan CHECK dalam pangkalan data.
      pilihan_jawapan: r.pilihan_jawapan ?? null,
      skema_jawapan: teks(r.skema_jawapan, 10000, `rows[${i}].skema_jawapan`),
    }));
    const data = semak(await db().from('koleksi_soalan').insert(rows).select('id')) as { id: string }[];
    return data.map((r) => r.id);
  },

  async getKoleksiSoalan(b) {
    const limit = intInRange(b.limit ?? 20, 1, 100, 'limit');
    const offset = intInRange(b.offset ?? 0, 0, 100000, 'offset');
    let q = db().from('koleksi_soalan')
      .select('id, tingkatan, bidang, tajuk, aras_kognitif, jenis_soalan, soalan, pilihan_jawapan, skema_jawapan, created_at',
        { count: 'exact' });
    const tingkatan = pilihan(b.tingkatan, (v) => intInRange(v, 1, 5, 'tingkatan'));
    const bidang = pilihan(b.bidang, (v) => oneOf(v, BIDANG, 'bidang'));
    const aras = pilihan(b.aras, (v) => oneOf(v, ARAS, 'aras'));
    if (tingkatan) q = q.eq('tingkatan', tingkatan);
    if (bidang) q = q.eq('bidang', bidang);
    if (aras) q = q.eq('aras_kognitif', aras);
    const { data, count, error } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw new Error(`DB: ${error.message}`);
    return { items: data, jumlah: count ?? 0 };
  },

  async padamSoalan(b) {
    semak(await db().from('koleksi_soalan').delete().eq('id', uuid(b.id, 'id')));
    return true;
  },

  // --- Soalan percubaan (himpunan kecil, ditapis di pelayar) -----------------
  async getPercubaan() {
    return semak(await db().from('soalan_percubaan')
      .select('id, no_asal, bidang, bahagian, no_soalan, soalan, markah, skema_jawapan, sumber, tag')
      .order('no_asal')
      .limit(2000));
  },
};

postHandler(async ({ body }) => {
  const op = typeof body.op === 'string' && Object.hasOwn(OPS, body.op) ? OPS[body.op] : null;
  if (!op) throw new HttpError(400, 'اوڤراسي تيدق دکنلي.');
  return { data: await op(body) };
});
