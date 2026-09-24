// POST /functions/v1/jana-soalan
// Body: { dskp_id, aras: 'Rendah'|'Sederhana'|'Tinggi'|'KBAT'|'Campuran', jenis: 'Objektif'|'Subjektif', bilangan: 1-20 }
// Soalan TIDAK disimpan ke bank di sini — guru semak dahulu, kemudian simpan melalui function `data`.
import { ARAS, JENIS, janaSoalanAI, type TajukDskp } from '../_shared/gemini.ts';
import { db, semak, semakHadPenjanaan, simpanLog } from '../_shared/db.ts';
import { HttpError, intInRange, oneOf, postHandler, uuid } from '../_shared/http.ts';

postHandler(async ({ body }) => {
  const params = {
    dskp_id: uuid(body.dskp_id, 'dskp_id'),
    aras: oneOf(body.aras, [...ARAS, 'Campuran'] as const, 'aras'),
    jenis: oneOf(body.jenis, JENIS, 'jenis'),
    bilangan: intInRange(body.bilangan, 1, 20, 'bilangan'),
  };

  // Pastikan tajuk wujud sebelum sebarang kos AI.
  const dskp = semak(await db()
    .from('dskp')
    .select('id, tingkatan, bidang, tajuk, standard_kandungan, standard_pembelajaran, objektif_pembelajaran')
    .eq('id', params.dskp_id)
    .maybeSingle()) as TajukDskp | null;
  if (!dskp) throw new HttpError(404, 'تاجوق DSKP تيدق دجومڤاي.');

  await semakHadPenjanaan();

  const soalan = await janaSoalanAI({ dskp, aras: params.aras, jenis: params.jenis, bilangan: params.bilangan });

  const konteks = { dskp_id: dskp.id, tingkatan: dskp.tingkatan, bidang: dskp.bidang, tajuk: dskp.tajuk };
  const log_id = await simpanLog('soalan', { ...params, ...konteks }, soalan);

  return { log_id, konteks, soalan };
});
