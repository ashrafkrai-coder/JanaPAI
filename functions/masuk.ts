// POST /v1/functions/masuk
// Body: { kata_laluan }
// Tukar kata laluan panitia (KATA_LALUAN_PANITIA, disimpan di server) kepada token akses 30 hari.
import { HttpError, postHandler } from './_lib/http';
import { kataLaluanBetul, keluarkanToken } from './_lib/token';

const tidur = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default postHandler(async ({ body }) => {
  const cubaan = typeof body.kata_laluan === 'string' ? body.kata_laluan : '';
  if (!cubaan || cubaan.length > 200 || !kataLaluanBetul(cubaan)) {
    await tidur(1500); // perlahankan cubaan meneka kata laluan
    throw new HttpError(401, 'کات لالوان تيدق بتول.');
  }
  return keluarkanToken();
}, { awam: true });
