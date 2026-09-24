// Fungsi pembantu data JanaPAI: query/mutation Hasura GraphQL + panggilan serverless function.
import { gql, callFunction } from './nhost.js';

// ---------------------------------------------------------------------------
// DSKP & Takwim
// ---------------------------------------------------------------------------

/** Ambil tajuk DSKP mengikut Tingkatan (dan Bidang, jika diberi), tersusun mengikut urutan silibus. */
export async function getDskp({ tingkatan, bidang = null }) {
  const where = { tingkatan: { _eq: tingkatan } };
  if (bidang) where.bidang = { _eq: bidang };

  const data = await gql(
    `query GetDskp($where: dskp_bool_exp!) {
      dskp(where: $where, order_by: [{ urutan: asc }, { bidang: asc }, { tajuk: asc }]) {
        id tingkatan bidang urutan tajuk
        standard_kandungan standard_pembelajaran objektif_pembelajaran
      }
    }`,
    { where },
  );
  return data.dskp;
}

export async function getTakwim({ tahun, kumpulan }) {
  const data = await gql(
    `query GetTakwim($tahun: smallint!, $kumpulan: bpchar!) {
      takwim_persekolahan(
        where: { tahun: { _eq: $tahun }, kumpulan: { _eq: $kumpulan } }
        order_by: { minggu_ke: asc }
      ) { id minggu_ke tarikh_mula tarikh_tamat minggu_pdp catatan }
    }`,
    { tahun, kumpulan },
  );
  return data.takwim_persekolahan;
}

// ---------------------------------------------------------------------------
// RPT
// ---------------------------------------------------------------------------

export async function getRpt({ tahun, tingkatan }) {
  const data = await gql(
    `query GetRpt($tahun: smallint!, $tingkatan: smallint!) {
      rpt(
        where: { tahun: { _eq: $tahun }, tingkatan: { _eq: $tingkatan } }
        order_by: [{ minggu_ke: asc }, { created_at: asc }]
      ) {
        id minggu_ke tarikh_mula tarikh_tamat tajuk_id catatan_aktiviti
        dskp { tajuk bidang }
      }
    }`,
    { tahun, tingkatan },
  );
  return data.rpt;
}

/**
 * Simpan RPT bagi (tahun, tingkatan): gantikan baris RPT lama bermula `dariMinggu` dengan baris baharu
 * (minggu sebelum itu — yang sudah diajar — dikekalkan).
 * Kedua-dua mutation dalam satu permintaan dijalankan oleh Hasura dalam SATU transaksi,
 * jadi RPT lama tidak akan hilang jika insert gagal.
 */
export async function simpanRpt({ tahun, tingkatan, dariMinggu = 1, minggu }) {
  const objects = minggu.map((m) => ({
    tahun,
    tingkatan,
    minggu_ke: m.minggu_ke,
    tarikh_mula: m.tarikh_mula,
    tarikh_tamat: m.tarikh_tamat,
    tajuk_id: m.tajuk_id || null, // "" dari <select> = tiada tajuk
    catatan_aktiviti: m.catatan_aktiviti ?? null,
  }));

  const data = await gql(
    `mutation SimpanRpt($tahun: smallint!, $tingkatan: smallint!, $dari: smallint!, $objects: [rpt_insert_input!]!) {
      delete_rpt(where: { tahun: { _eq: $tahun }, tingkatan: { _eq: $tingkatan }, minggu_ke: { _gte: $dari } }) {
        affected_rows
      }
      insert_rpt(objects: $objects) { affected_rows }
    }`,
    { tahun, tingkatan, dari: dariMinggu, objects },
  );
  return data.insert_rpt.affected_rows;
}

// ---------------------------------------------------------------------------
// Bank soalan
// ---------------------------------------------------------------------------

/** Tukar satu soalan hasil AI kepada baris `koleksi_soalan`. */
export function toKoleksiRow(soalan, konteks) {
  const objektif = soalan.jenis_soalan === 'Objektif';
  // Jika guru menukar jawapan betul semasa menyunting, selaraskan baris "Jawapan: X" dalam skema.
  const skema = objektif
    ? soalan.skema_jawapan.replace(/^Jawapan:\s*[A-D]/, `Jawapan: ${soalan.jawapan_betul}`)
    : soalan.skema_jawapan;
  return {
    dskp_id: konteks.dskp_id ?? null,
    tingkatan: konteks.tingkatan,
    bidang: konteks.bidang,
    tajuk: konteks.tajuk,
    aras_kognitif: soalan.aras_kognitif,
    jenis_soalan: soalan.jenis_soalan,
    soalan: soalan.soalan,
    pilihan_jawapan: objektif ? soalan.pilihan_jawapan : null,
    skema_jawapan: skema,
  };
}

/** Simpan soalan yang baru dijana ke dalam `koleksi_soalan`. `user_id` diisi oleh Hasura. */
export async function simpanSoalan(rows) {
  const data = await gql(
    `mutation SimpanSoalan($objects: [koleksi_soalan_insert_input!]!) {
      insert_koleksi_soalan(objects: $objects) { affected_rows returning { id } }
    }`,
    { objects: rows },
  );
  return data.insert_koleksi_soalan.returning.map((r) => r.id);
}

export async function getKoleksiSoalan({ tingkatan = null, bidang = null, aras = null, limit = 50, offset = 0 } = {}) {
  const where = {};
  if (tingkatan) where.tingkatan = { _eq: tingkatan };
  if (bidang) where.bidang = { _eq: bidang };
  if (aras) where.aras_kognitif = { _eq: aras };

  const data = await gql(
    `query KoleksiSoalan($where: koleksi_soalan_bool_exp!, $limit: Int!, $offset: Int!) {
      koleksi_soalan(where: $where, order_by: { created_at: desc }, limit: $limit, offset: $offset) {
        id tingkatan bidang tajuk aras_kognitif jenis_soalan soalan pilihan_jawapan skema_jawapan created_at
      }
      koleksi_soalan_aggregate(where: $where) { aggregate { count } }
    }`,
    { where, limit, offset },
  );
  return { items: data.koleksi_soalan, jumlah: data.koleksi_soalan_aggregate.aggregate.count };
}

export async function padamSoalan(id) {
  await gql(
    `mutation PadamSoalan($id: uuid!) { delete_koleksi_soalan_by_pk(id: $id) { id } }`,
    { id },
  );
}

// ---------------------------------------------------------------------------
// Penjana AI (serverless functions — kunci Gemini kekal di server)
// ---------------------------------------------------------------------------

/**
 * @param {{ dskp_id: string, aras: 'Rendah'|'Sederhana'|'Tinggi'|'KBAT'|'Campuran',
 *           jenis: 'Objektif'|'Subjektif', bilangan: number }} params
 * @returns {Promise<{ log_id: string|null, konteks: object, soalan: object[] }>}
 */
export const janaSoalan = (params) => callFunction('/jana-soalan', params);

/**
 * @param {{ tahun: number, kumpulan: 'A'|'B', tingkatan: number, dskp_ids: string[], dari_minggu?: number }} params
 * @returns {Promise<{ log_id: string|null, minggu: object[], tajuk_tertinggal: string[], nota: string }>}
 */
export const janaRpt = (params) => callFunction('/jana-rpt', params);
