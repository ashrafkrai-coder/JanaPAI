// Token akses panitia (JWT) — pengganti log masuk akaun.
// Ditandatangani dengan kunci yang SAMA seperti Hasura (NHOST_JWT_SECRET, disediakan oleh Nhost
// kepada functions), jadi Hasura menerima token ini secara terus dengan role `panitia`.
// Menyokong HS256/384/512 (kunci kongsi) dan RS256/384/512 (kunci peribadi `signing_key`).
// Tiada pakej tambahan: guna modul `crypto` Node sahaja.
import { createHmac, sign, timingSafeEqual, verify } from 'node:crypto';
import { HttpError } from './http';

const ROLE = 'panitia';
const TEMPOH_SAAT = 30 * 24 * 60 * 60; // 30 hari

const HASH = {
  HS256: 'sha256', HS384: 'sha384', HS512: 'sha512',
  RS256: 'sha256', RS384: 'sha384', RS512: 'sha512',
} as const;
type Alg = keyof typeof HASH;

interface KonfigJwt { alg: Alg; key: string; signingKey?: string }

/** Kunci & algoritma yang dikongsi dengan Hasura. Format Nhost: {"type":"RS256","key":"...","signing_key":"..."}. */
function konfigJwt(): KonfigJwt {
  const raw = process.env.NHOST_JWT_SECRET;
  if (!raw) throw new HttpError(500, 'تتڤن ڤلاين: NHOST_JWT_SECRET تيدق دتتڤکن.');
  let cfg: Record<string, unknown>;
  try {
    cfg = JSON.parse(raw);
  } catch {
    return { alg: 'HS256', key: raw }; // kunci mentah
  }
  const alg = String(cfg.type ?? 'HS256') as Alg;
  if (!(alg in HASH)) throw new HttpError(500, `تتڤن ڤلاين: جنيس JWT ${alg} تيدق دسوکوڠ.`);
  const key = typeof cfg.key === 'string' ? cfg.key : '';
  const signingKey = [cfg.signing_key, cfg.signingKey].find((v): v is string => typeof v === 'string');
  if (!key || (alg.startsWith('RS') && !signingKey)) {
    // Senarai NAMA medan sahaja (tiada nilai) untuk membantu diagnosis.
    throw new HttpError(500, `تتڤن ڤلاين: NHOST_JWT_SECRET (${alg}) تياد کونچي ڤريبادي. ميدن: ${Object.keys(cfg).join(', ')}`);
  }
  return { alg, key, signingKey };
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

function tandatangan(data: string, k: KonfigJwt): Buffer {
  return k.alg.startsWith('HS')
    ? createHmac(HASH[k.alg], k.key).update(data).digest()
    : sign(HASH[k.alg], Buffer.from(data), k.signingKey!);
}

function tandatanganSah(data: string, sig: Buffer, k: KonfigJwt): boolean {
  if (k.alg.startsWith('RS')) return verify(HASH[k.alg], Buffer.from(data), k.key, sig);
  const jangka = tandatangan(data, k);
  return sig.length === jangka.length && timingSafeEqual(sig, jangka);
}

export function keluarkanToken(): { token: string; tamat: number } {
  const sekarang = Math.floor(Date.now() / 1000);
  const tamat = sekarang + TEMPOH_SAAT;
  const k = konfigJwt();
  const header = b64url(JSON.stringify({ alg: k.alg, typ: 'JWT' }));
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
  return { token: `${header}.${payload}.${b64url(tandatangan(`${header}.${payload}`, k))}`, tamat };
}

/** Sahkan header `Authorization: Bearer <token>`. Pulangkan true jika token panitia sah dan belum tamat. */
export function tokenSah(authorization: string | undefined): boolean {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  const [header, payload, sig] = token.split('.');
  if (!header || !payload || !sig) return false;

  const k = konfigJwt();
  try {
    const h = JSON.parse(Buffer.from(header, 'base64url').toString()) as { alg?: string };
    if (h.alg !== k.alg) return false; // elak serangan tukar algoritma
    if (!tandatanganSah(`${header}.${payload}`, Buffer.from(sig, 'base64url'), k)) return false;
  } catch {
    return false;
  }

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
  // Nama pemboleh ubah (bukan nilainya) dipaparkan supaya salah konfigurasi mudah dikesan.
  if (!betul) throw new HttpError(500, 'تتڤن ڤلاين: KATA_LALUAN_PANITIA تيدق دتتڤکن.');
  const a = createHmac('sha256', 'janapai').update(cubaan).digest();
  const b = createHmac('sha256', 'janapai').update(betul).digest();
  return timingSafeEqual(a, b);
}
