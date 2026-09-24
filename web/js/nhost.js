// Sambungan ke backend Nhost (Hasura GraphQL + Functions) menggunakan token panitia.
// Tiada akaun pengguna: token dikeluarkan oleh function `masuk` selepas kata laluan panitia
// disahkan, lalu dihantar sebagai `Authorization: Bearer` kepada Hasura dan Functions.
import { NHOST_CONFIG } from './config.js';

const { subdomain, region } = NHOST_CONFIG;
const GRAPHQL_URL = `https://${subdomain}.graphql.${region}.nhost.run/v1`;
const FUNCTIONS_URL = `https://${subdomain}.functions.${region}.nhost.run/v1`;
const KUNCI = 'janapai:token';

// ---------------------------------------------------------------------------
// Token (localStorage — selamat jika tiada; pengguna hanya perlu masuk semula)
// ---------------------------------------------------------------------------

function bacaToken() {
  try {
    const t = JSON.parse(localStorage.getItem(KUNCI));
    return t && t.tamat * 1000 > Date.now() ? t : null;
  } catch {
    return null;
  }
}

function simpanToken(t) {
  try {
    if (t) localStorage.setItem(KUNCI, JSON.stringify(t));
    else localStorage.removeItem(KUNCI);
  } catch { /* abaikan */ }
}

let token = bacaToken();
const pendengar = new Set();

export const sudahMasuk = () => !!token && token.tamat * 1000 > Date.now();

/** Dipanggil apabila status masuk berubah (masuk / keluar / token tamat). */
export function onMasukChange(cb) {
  pendengar.add(cb);
  return () => pendengar.delete(cb);
}

function tetapkanToken(t) {
  token = t;
  simpanToken(t);
  pendengar.forEach((cb) => cb(!!t));
}

export function keluar() {
  tetapkanToken(null);
}

// ---------------------------------------------------------------------------
// Permintaan
// ---------------------------------------------------------------------------

async function post(url, payload, denganToken = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (denganToken && token) headers.Authorization = `Bearer ${token.token}`;

  let res;
  try {
    res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  } catch {
    throw new Error('تيدق داڤت مڠهوبوڠي ڤلاين. سيلا سمق سمبوڠن اينترنيت.');
  }
  const body = await res.json().catch(() => ({}));

  // Token tamat / tidak sah → minta kata laluan semula.
  const jwtRosak = body?.errors?.some((e) => ['invalid-jwt', 'invalid-headers', 'access-denied'].includes(e.extensions?.code));
  if (denganToken && (res.status === 401 || jwtRosak)) {
    tetapkanToken(null);
    throw new Error('سسي تامت. سيلا ماسوقکن کات لالوان ڤانيتيا سمولا.');
  }
  if (body?.errors?.length) throw new Error(body.errors.map((e) => e.message).join('; '));
  if (!res.ok) throw new Error(body?.message ?? `رالت ${res.status}`);
  return body;
}

/** Tukar kata laluan panitia kepada token. Membaling Error jika salah. */
export async function masuk(kataLaluan) {
  const t = await post(`${FUNCTIONS_URL}/masuk`, { kata_laluan: kataLaluan }, false);
  tetapkanToken(t);
}

/** Laksana query/mutation Hasura dan pulangkan `data` sahaja. Membaling Error jika gagal. */
export async function gql(query, variables = {}) {
  const body = await post(GRAPHQL_URL, { query, variables });
  return body.data;
}

/** Panggil serverless function Nhost (POST JSON). */
export const callFunction = (path, payload) => post(`${FUNCTIONS_URL}${path}`, payload);
