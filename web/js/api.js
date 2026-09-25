// Fungsi pembantu data JanaPAI: operasi function `data` + penjana AI (Edge Functions Supabase).
import { callFunction, data } from './backend.js';

// ---------------------------------------------------------------------------
// DSKP & Takwim
// ---------------------------------------------------------------------------

/** Ambil tajuk DSKP mengikut Tingkatan (dan Bidang, jika diberi), tersusun mengikut urutan silibus. */
export const getDskp = ({ tingkatan, bidang = null }) => data('getDskp', { tingkatan, bidang });

export const getTakwim = ({ tahun, kumpulan }) => data('getTakwim', { tahun, kumpulan });

// ---------------------------------------------------------------------------
// RPT
// ---------------------------------------------------------------------------

export const getRpt = ({ tahun, tingkatan }) => data('getRpt', { tahun, tingkatan });

/**
 * Simpan RPT bagi (tahun, tingkatan): gantikan baris RPT lama bermula `dariMinggu` dengan baris baharu
 * (minggu sebelum itu — yang sudah diajar — dikekalkan). Dilaksanakan dalam SATU transaksi
 * (fungsi SQL `simpan_rpt`), jadi RPT lama tidak akan hilang jika sisipan gagal.
 */
export function simpanRpt({ tahun, tingkatan, dariMinggu = 1, minggu }) {
  return data('simpanRpt', {
    tahun,
    tingkatan,
    dariMinggu,
    minggu: minggu.map((m) => ({
      minggu_ke: m.minggu_ke,
      tarikh_mula: m.tarikh_mula,
      tarikh_tamat: m.tarikh_tamat,
      tajuk_id: m.tajuk_id || null, // "" dari <select> = tiada tajuk
      catatan_aktiviti: m.catatan_aktiviti ?? null,
    })),
  });
}

// ---------------------------------------------------------------------------
// Bank soalan
// ---------------------------------------------------------------------------

/** Tukar satu soalan hasil AI kepada baris `koleksi_soalan`. */
export function toKoleksiRow(soalan, konteks) {
  const objektif = soalan.jenis_soalan === 'Objektif';
  // Jika guru menukar jawapan betul semasa menyunting, selaraskan baris "Jawapan: X" dalam skema.
  const skema = objektif
    ? soalan.skema_jawapan.replace(/^(جواڤن|Jawapan):\s*[A-D]/, `Jawapan: ${soalan.jawapan_betul}`)
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

/** Simpan soalan yang baru dijana ke dalam bank (dikongsi oleh panitia). Pulangkan senarai id. */
export const simpanSoalan = (rows) => data('simpanSoalan', { rows });

/** @returns {Promise<{ items: object[], jumlah: number }>} */
export const getKoleksiSoalan = ({ tingkatan = null, bidang = null, aras = null, limit = 50, offset = 0 } = {}) =>
  data('getKoleksiSoalan', { tingkatan, bidang, aras, limit, offset });

export const padamSoalan = (id) => data('padamSoalan', { id });

// ---------------------------------------------------------------------------
// Soalan percubaan / ramalan SPM (Rumi, baca sahaja)
// ---------------------------------------------------------------------------

export const getPercubaan = () => data('getPercubaan');

// ---------------------------------------------------------------------------
// Penjana AI (Edge Functions — kunci Gemini kekal di server)
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

/**
 * Satu soalan Kertas 1 SPM (20 markah, bahagian a-c). Kertas penuh = 5 panggilan serentak.
 * @param {{ nombor: 1|2|3|4|5, dskp_ids?: string[] }} params
 * @returns {Promise<{ log_id: string|null, soalan: object }>}
 */
export const janaSpm = (params) => callFunction('/jana-spm', params);
