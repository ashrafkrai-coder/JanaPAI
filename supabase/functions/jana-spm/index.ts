// POST /functions/v1/jana-spm
// Body: { nombor: 1-5, tulisan: 'Rumi'|'Jawi', dskp_ids?: string[] (maks 3, tajuk fokus T4/T5) }
// Jana SATU soalan Kertas 1 SPM (20 markah, bahagian a-c). Kertas penuh = 5 panggilan serentak dari pelayar.
import { BIDANG_SPM, janaSpmAI, TULISAN, type ContohSpm, type TajukDskp } from '../_shared/gemini.ts';
import { db, semak, semakHadPenjanaan, simpanLog } from '../_shared/db.ts';
import { HttpError, intInRange, oneOf, postHandler, uuid } from '../_shared/http.ts';

const KOLUM_DSKP = 'id, tingkatan, bidang, tajuk, standard_kandungan, standard_pembelajaran, standard_prestasi, objektif_pembelajaran';
const BIL_CONTOH = 12;

postHandler(async ({ body }) => {
  const nombor = intInRange(body.nombor, 1, 5, 'nombor');
  const tulisan = oneOf(body.tulisan ?? 'Rumi', TULISAN, 'tulisan');
  const bidang = BIDANG_SPM[nombor];
  if (body.dskp_ids != null && (!Array.isArray(body.dskp_ids) || body.dskp_ids.length > 3)) {
    throw new HttpError(400, 'dskp_ids تيدق صح (مکسيموم 3).');
  }
  const dskpIds = [...new Set(((body.dskp_ids as unknown[]) ?? []).map((id, i) => uuid(id, `dskp_ids[${i}]`)))];

  let q = db().from('dskp').select(KOLUM_DSKP).in('tingkatan', [4, 5]).in('bidang', [...bidang]);
  if (dskpIds.length) q = q.in('id', dskpIds);
  const [tajuk, contohSemua] = await Promise.all([
    q.order('tingkatan').order('urutan').then((r) => semak(r) as TajukDskp[]),
    db().from('soalan_percubaan')
      .select('bahagian, soalan, markah, skema_jawapan')
      .ilike('bahagian', `Soalan ${nombor}%`)
      .then((r) => semak(r) as ContohSpm[]),
  ]);
  if (!tajuk.length) throw new HttpError(404, 'تاجوق DSKP تيڠکتن 4/5 اونتوق سوالن اين تيدق دجومڤاي.');

  // Sampel rawak supaya gaya contoh berubah setiap kali.
  const contoh = contohSemua.map((c) => [Math.random(), c] as const).sort((a, b) => a[0] - b[0])
    .slice(0, BIL_CONTOH).map(([, c]) => c);

  await semakHadPenjanaan();

  const soalan = await janaSpmAI({ nombor, tulisan, tajuk, contoh });
  const log_id = await simpanLog('spm', { nombor, tulisan, dskp_ids: dskpIds }, soalan);

  return { log_id, tulisan, soalan };
});
