// Sambungan ke backend Nhost menggunakan @nhost/nhost-js v4.
// Dimuatkan terus dari CDN (tiada langkah build). Untuk projek Vite/bundler:
//   npm i @nhost/nhost-js  dan tukar import kepada: import { createClient } from '@nhost/nhost-js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@nhost/nhost-js@4.8.0/+esm';
import { NHOST_CONFIG } from './config.js';

// createClient: sesi disimpan di localStorage dan token disegar semula secara automatik.
export const nhost = createClient(NHOST_CONFIG);

// ---------------------------------------------------------------------------
// Ralat
// ---------------------------------------------------------------------------

/** Tukar FetchError nhost-js (GraphQL / Auth / Functions) kepada mesej yang boleh dibaca. */
export function errorMessage(err) {
  const body = err?.body;
  if (body?.errors?.length) return body.errors.map((e) => e.message).join('; '); // GraphQL
  if (body?.message) return body.message;                                          // Auth / Functions
  if (body?.error) return typeof body.error === 'string' ? body.error : JSON.stringify(body.error);
  return err?.message ?? String(err);
}

// ---------------------------------------------------------------------------
// GraphQL & Functions
// ---------------------------------------------------------------------------

/** Laksana query/mutation Hasura dan pulangkan `data` sahaja. Membaling Error jika gagal. */
export async function gql(query, variables = {}) {
  try {
    const res = await nhost.graphql.request({ query, variables });
    return res.body.data;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}

/** Panggil serverless function Nhost (POST JSON). Token pengguna dilampirkan secara automatik. */
export async function callFunction(path, payload) {
  try {
    const res = await nhost.functions.post(path, payload);
    return res.body;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const currentUser = () => nhost.getUserSession()?.user ?? null;

/** Dipanggil setiap kali sesi berubah (log masuk / log keluar / token disegar). Pulangkan fungsi unsubscribe. */
export const onAuthChange = (callback) =>
  nhost.sessionStorage.onChange((session) => callback(session?.user ?? null));

export async function signIn(email, password) {
  try {
    const res = await nhost.auth.signInEmailPassword({ email, password });
    if (!res.body.session) throw new Error('Log masuk memerlukan pengesahan tambahan (MFA).');
    return res.body.session.user;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}

export async function signUp(email, password, displayName) {
  try {
    const res = await nhost.auth.signUpEmailPassword({ email, password, options: { displayName } });
    // session = null jika pengesahan e-mel diwajibkan dalam tetapan Auth projek.
    return res.body.session?.user ?? null;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}

export async function signOut() {
  const session = nhost.getUserSession();
  try {
    if (session) await nhost.auth.signOut({ refreshToken: session.refreshToken });
  } finally {
    nhost.clearSession();
  }
}
