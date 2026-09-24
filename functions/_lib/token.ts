// Token akses panitia (JWT HS256) — pengganti log masuk akaun.
// Ditandatangani dengan kunci yang SAMA seperti Hasura (NHOST_JWT_SECRET, disediakan oleh Nhost
// kepada functions), jadi Hasura menerima token ini secara terus dengan role `panitia`.
// Tiada pakej tambahan: guna modul `crypto` Node sahaja.
import { createHmac, timingSafeEqual } from 'node:crypto';

const ROLE = 'panitia';
const TEMPOH_SAAT = 30 * 24 * 60 * 60; // 30 hari

function kunci(): string {
  const raw = process.env.NHOST_JWT_SECRET;
  if (!raw) throw new Error('NHOST_JWT_SECRET tidak ditetapkan');
  // Format Nhost: {"type":"HS256","key":"..."}; terima juga kunci mentah.
  try {
    const cfg = JSON.parse(raw) as { type?: string; key?: string };
    if (cfg.type && cfg.type !== 'HS256') throw new Error(`Jenis JWT ${cfg.type} tidak disokong`);
    if (cfg.key) return cfg.key;
  } catch (err) {
    if (err instanceof SyntaxError) return raw;
    throw err;
  }
  return raw;
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');
const tandatangan = (data: string) => createHmac('sha256', kunci()).update(data).digest();

export function keluarkanToken(): { token: string; tamat: number } {
  const sekarang = Math.floor(Date.now() / 1000);
  const tamat = sekarang + TEMPOH_SAAT;
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    sub: ROLE,
    iss: 'hasura-auth',
    iat: sekarang,
    exp: tamat,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': [ROLE],
      'x-hasura-default-role': ROLE,
    },
  }));
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
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      exp?: number; 'https://hasura.io/jwt/claims'?: { 'x-hasura-default-role'?: string };
    };
    return (claims.exp ?? 0) > Date.now() / 1000
      && claims['https://hasura.io/jwt/claims']?.['x-hasura-default-role'] === ROLE;
  } catch {
    return false;
  }
}

/** Banding kata laluan dalam masa tetap (elak serangan pemasaan). */
export function kataLaluanBetul(cubaan: string): boolean {
  const betul = process.env.KATA_LALUAN_PANITIA;
  if (!betul) throw new Error('KATA_LALUAN_PANITIA tidak ditetapkan');
  const a = createHmac('sha256', 'janapai').update(cubaan).digest();
  const b = createHmac('sha256', 'janapai').update(betul).digest();
  return timingSafeEqual(a, b);
}
