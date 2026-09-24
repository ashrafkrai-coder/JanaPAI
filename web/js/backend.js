// Sambungan ke backend Supabase (Edge Functions) menggunakan token panitia.
// Tiada akaun pengguna: token dikeluarkan oleh function `masuk` selepas kata laluan panitia
// disahkan, lalu dihantar sebagai `Authorization: Bearer`. Pelayar tidak pernah menyentuh
// pangkalan data secara terus — semua data melalui function `data`.
import { SUPABASE_URL } from './config.js';

const FUNCTIONS_URL = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1`;
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

  // Token tamat / tidak sah (atau kata laluan panitia telah ditukar) → minta kata laluan semula.
  if (denganToken && res.status === 401) {
    tetapkanToken(null);
    throw new Error('سسي تامت. سيلا ماسوقکن کات لالوان ڤانيتيا سمولا.');
  }
  if (!res.ok) throw new Error(body?.message ?? `رالت ${res.status}`);
  return body;
}

/** Tukar kata laluan panitia kepada token. Membaling Error jika salah. */
export async function masuk(kataLaluan) {
  const t = await post(`${FUNCTIONS_URL}/masuk`, { kata_laluan: kataLaluan }, false);
  tetapkanToken(t);
}

/** Laksana satu operasi data (lihat OPS dalam supabase/functions/data) dan pulangkan hasilnya. */
export async function data(op, params = {}) {
  const body = await post(`${FUNCTIONS_URL}/data`, { op, ...params });
  return body.data;
}

/** Panggil Edge Function (POST JSON). */
export const callFunction = (path, payload) => post(`${FUNCTIONS_URL}${path}`, payload);
