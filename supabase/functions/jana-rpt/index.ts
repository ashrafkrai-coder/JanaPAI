// POST /functions/v1/jana-rpt
// Body: { tahun, kumpulan: 'A'|'B', tingkatan: 1-5, dskp_ids: string[] (tajuk belum diajar, ikut urutan), dari_minggu?: number }
// Pulangkan cadangan RPT untuk dipratonton. Simpanan dibuat melalui function `data` (simpanRpt).
import { janaRptAI, type MingguTakwim, type TajukDskp } from '../_shared/gemini.ts';
import { db, semak, semakHadPenjanaan, simpanLog } from '../_shared/db.ts';
import { HttpError, intInRange, oneOf, postHandler, uuid } from '../_shared/http.ts';

postHandler(async ({ body }) => {
  const tahun = intInRange(body.tahun, 2020, 2100, 'tahun');
  const kumpulan = oneOf(body.kumpulan, ['A', 'B'] as const, 'kumpulan');
  const tingkatan = intInRange(body.tingkatan, 1, 5, 'tingkatan');
  const dari_minggu = body.dari_minggu == null ? 1 : intInRange(body.dari_minggu, 1, 53, 'dari_minggu');
  if (!Array.isArray(body.dskp_ids) || !body.dskp_ids.length || body.dskp_ids.length > 150) {
    throw new HttpError(400, 'ڤيليه سکورڠ-کورڠڽ ساتو تاجوق DSKP (مکسيموم 150).');
  }
  const dskpIds = [...new Set(body.dskp_ids.map((id, i) => uuid(id, `dskp_ids[${i}]`)))];

  const [takwim, dskp] = await Promise.all([
    db().from('takwim_persekolahan')
      .select('minggu_ke, tarikh_mula, tarikh_tamat, minggu_pdp, catatan')
      .eq('tahun', tahun).eq('kumpulan', kumpulan).gte('minggu_ke', dari_minggu)
      .order('minggu_ke')
      .then((r) => semak(r) as MingguTakwim[]),
    db().from('dskp')
      .select('id, tingkatan, bidang, tajuk, standard_kandungan, standard_pembelajaran, standard_prestasi, objektif_pembelajaran')
      .in('id', dskpIds).eq('tingkatan', tingkatan)
      .then((r) => semak(r) as TajukDskp[]),
  ]);

  if (!takwim.length) {
    throw new HttpError(404, `تقويم ${tahun} (کومڤولن ${kumpulan}) بلوم دماسوقکن ک ڤڠکالن داتا.`);
  }
  if (!takwim.some((m) => m.minggu_pdp)) {
    throw new HttpError(400, 'تياد ميڠݢو PdP دالم جولت تقويم يڠ دڤيليه.');
  }
  if (!dskp.length) throw new HttpError(404, 'تاجوق DSKP تيدق دجومڤاي اونتوق تيڠکتن اين.');

  // Kekalkan urutan yang dipilih oleh guru (`in` tidak menjamin urutan).
  const kedudukan = new Map(dskpIds.map((id, i) => [id, i]));
  const tajuk = [...dskp].sort((a, b) => kedudukan.get(a.id)! - kedudukan.get(b.id)!);

  await semakHadPenjanaan();

  const hasil = await janaRptAI({ tingkatan, takwim, tajuk });

  const log_id = await simpanLog('rpt', { tahun, kumpulan, tingkatan, dari_minggu, dskp_ids: dskpIds }, hasil);

  return { log_id, minggu: hasil.baris, tajuk_tertinggal: hasil.tajuk_tertinggal, nota: hasil.nota };
});
