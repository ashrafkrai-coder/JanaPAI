// Token akses panitia (JWT HS256) — pengganti log masuk akaun.
// Token hanya disahkan oleh Edge Functions kita; pelayar TIDAK bercakap terus dengan pangkalan
// data. Kuncinya diterbitkan daripada SUPABASE_SERVICE_ROLE_KEY + KATA_LALUAN_PANITIA, jadi
// menukar kata laluan panitia membatalkan semua token lama serta-merta.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { HttpError } from './http.ts';

const ROLE = 'panitia';
const TEMPOH_SAAT = 30 * 24 * 60 * 60; // 30 hari

function env(nama: string): string {
  const v = Deno.env.get(nama);
  // Nama pemboleh ubah (bukan nilainya) dipaparkan supaya salah konfigurasi mudah dikesan.
  if (!v) throw new HttpError(500, `تتڤن ڤلاين: ${nama} تيدق دتتڤکن.`);
  return v;
}

const kunci = () =>
  createHmac('sha256', env('SUPABASE_SERVICE_ROLE_KEY')).update(`janapai-token:${env('KATA_LALUAN_PANITIA')}`).digest();

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');
const tandatangan = (data: string) => createHmac('sha256', kunci()).update(data).digest();

export function keluarkanToken(): { token: string; tamat: number } {
  const sekarang = Math.floor(Date.now() / 1000);
  const tamat = sekarang + TEMPOH_SAAT;
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ sub: ROLE, role: ROLE, iss: 'janapai', iat: sekarang, exp: tamat }));
  return { token: `${header}.${payload}.${b64url(tandatangan(`${header}.${payload}`))}`, tamat };
}

/** Sahkan header `Authorization: Bearer <token>`. Pulangkan true jika token panitia sah dan belum tamat. */
export function tokenSah(authorization: string | undefined): boolean {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const [header, payload, sig] = token.split('.');
  if (!header || !payload || !sig) return false;

  const jangka = tandatangan(`${header}.${payload}`);
  const diberi = Buffer.from(sig, 'base64url');
  if (diberi.length !== jangka.length || !timingSafeEqual(diberi, jangka)) return false;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number; role?: string };
    return (claims.exp ?? 0) > Date.now() / 1000 && claims.role === ROLE;
  } catch {
    return false;
  }
}

/** Banding kata laluan dalam masa tetap (elak serangan pemasaan). */
export function kataLaluanBetul(cubaan: string): boolean {
  const a = createHmac('sha256', 'janapai').update(cubaan).digest();
  const b = createHmac('sha256', 'janapai').update(env('KATA_LALUAN_PANITIA')).digest();
  return timingSafeEqual(a, b);
}
