// POST /v1/functions/jana-soalan
// Body: { dskp_id, aras: 'Rendah'|'Sederhana'|'Tinggi'|'KBAT'|'Campuran', jenis: 'Objektif'|'Subjektif', bilangan: 1-20 }
// Soalan TIDAK disimpan ke bank di sini — guru semak dahulu, kemudian simpan dari frontend.
import { ARAS, JENIS, janaSoalanAI, type TajukDskp } from './_lib/gemini';
import { hasuraAdmin, semakHadPenjanaan, simpanLog } from './_lib/hasura';
import { HttpError, intInRange, oneOf, postHandler, uuid } from './_lib/http';

export default postHandler(async ({ body }) => {
  const params = {
    dskp_id: uuid(body.dskp_id, 'dskp_id'),
    aras: oneOf(body.aras, [...ARAS, 'Campuran'] as const, 'aras'),
    jenis: oneOf(body.jenis, JENIS, 'jenis'),
    bilangan: intInRange(body.bilangan, 1, 20, 'bilangan'),
  };

  // Pastikan tajuk wujud sebelum sebarang kos AI.
  const { dskp_by_pk: dskp } = await hasuraAdmin<{ dskp_by_pk: TajukDskp | null }>(
    `query Tajuk($id: uuid!) {
      dskp_by_pk(id: $id) {
        id tingkatan bidang tajuk standard_kandungan standard_pembelajaran objektif_pembelajaran
      }
    }`,
    { id: params.dskp_id },
  );
  if (!dskp) throw new HttpError(404, 'تاجوق DSKP تيدق دجومڤاي.');

  await semakHadPenjanaan();

  const soalan = await janaSoalanAI({ dskp, aras: params.aras, jenis: params.jenis, bilangan: params.bilangan });

  const konteks = { dskp_id: dskp.id, tingkatan: dskp.tingkatan, bidang: dskp.bidang, tajuk: dskp.tajuk };
  const log_id = await simpanLog('soalan', { ...params, ...konteks }, soalan);

  return { log_id, konteks, soalan };
});
