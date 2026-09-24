// POST /v1/functions/jana-rpt
// Body: { tahun, kumpulan: 'A'|'B', tingkatan: 1-5, dskp_ids: string[] (tajuk belum diajar, ikut urutan), dari_minggu?: number }
// Pulangkan cadangan RPT untuk dipratonton. Simpanan dibuat dari frontend (simpanRpt).
import { janaRptAI, type MingguTakwim, type TajukDskp } from './_lib/gemini';
import { hasuraAsUser, semakHadPenjanaan, simpanLog } from './_lib/hasura';
import { HttpError, intInRange, oneOf, postHandler, uuid } from './_lib/http';

export default postHandler(async ({ body, authorization }) => {
  const tahun = intInRange(body.tahun, 2020, 2100, 'tahun');
  const kumpulan = oneOf(body.kumpulan, ['A', 'B'] as const, 'kumpulan');
  const tingkatan = intInRange(body.tingkatan, 1, 5, 'tingkatan');
  const dari_minggu = body.dari_minggu == null ? 1 : intInRange(body.dari_minggu, 1, 53, 'dari_minggu');
  if (!Array.isArray(body.dskp_ids) || !body.dskp_ids.length || body.dskp_ids.length > 150) {
    throw new HttpError(400, 'Pilih sekurang-kurangnya satu tajuk DSKP (maksimum 150).');
  }
  const dskpIds = [...new Set(body.dskp_ids.map((id, i) => uuid(id, `dskp_ids[${i}]`)))];

  const data = await hasuraAsUser<{ takwim_persekolahan: MingguTakwim[]; dskp: TajukDskp[] }>(
    authorization,
    `query DataRpt($tahun: smallint!, $kumpulan: bpchar!, $dari: smallint!, $tingkatan: smallint!, $ids: [uuid!]!) {
      takwim_persekolahan(
        where: { tahun: { _eq: $tahun }, kumpulan: { _eq: $kumpulan }, minggu_ke: { _gte: $dari } }
        order_by: { minggu_ke: asc }
      ) { minggu_ke tarikh_mula tarikh_tamat minggu_pdp catatan }
      dskp(where: { id: { _in: $ids }, tingkatan: { _eq: $tingkatan } }) {
        id tingkatan bidang tajuk standard_kandungan standard_pembelajaran objektif_pembelajaran
      }
    }`,
    { tahun, kumpulan, dari: dari_minggu, tingkatan, ids: dskpIds },
  );

  if (!data.takwim_persekolahan.length) {
    throw new HttpError(404, `Takwim ${tahun} (Kumpulan ${kumpulan}) belum dimasukkan ke pangkalan data.`);
  }
  if (!data.takwim_persekolahan.some((m) => m.minggu_pdp)) {
    throw new HttpError(400, 'Tiada minggu PdP dalam julat takwim yang dipilih.');
  }
  if (!data.dskp.length) throw new HttpError(404, 'Tajuk DSKP tidak dijumpai untuk tingkatan ini.');

  // Kekalkan urutan yang dipilih oleh guru (Hasura tidak menjamin urutan _in).
  const kedudukan = new Map(dskpIds.map((id, i) => [id, i]));
  const tajuk = [...data.dskp].sort((a, b) => kedudukan.get(a.id)! - kedudukan.get(b.id)!);

  await semakHadPenjanaan(authorization);

  const hasil = await janaRptAI({ tingkatan, takwim: data.takwim_persekolahan, tajuk });

  const log_id = await simpanLog(
    authorization,
    'rpt',
    { tahun, kumpulan, tingkatan, dari_minggu, dskp_ids: dskpIds },
    hasil,
  );

  return { log_id, minggu: hasil.baris, tajuk_tertinggal: hasil.tajuk_tertinggal, nota: hasil.nota };
});
