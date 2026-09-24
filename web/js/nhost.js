// Sambungan ke backend Nhost menggunakan @nhost/nhost-js v4.
// Dimuatkan terus dari CDN (tiada langkah build). Untuk projek Vite/bundler:
//   npm i @nhost/nhost-js  dan tukar import kepada: import { createClient } from '@nhost/nhost-js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@nhost/nhost-js@4.8.0/+esm';
import { NHOST_CONFIG } from './config.js';

// Aplikasi tanpa log masuk: permintaan dihantar tanpa token, jadi Hasura menggunakan role `public`.
export const nhost = createClient(NHOST_CONFIG);

// ---------------------------------------------------------------------------
// Ralat
// ---------------------------------------------------------------------------

/** Tukar FetchError nhost-js (GraphQL / Functions) kepada mesej yang boleh dibaca. */
export function errorMessage(err) {
  const body = err?.body;
  if (body?.errors?.length) return body.errors.map((e) => e.message).join('; '); // GraphQL
  if (body?.message) return body.message;                                          // Functions
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

/** Panggil serverless function Nhost (POST JSON). */
export async function callFunction(path, payload) {
  try {
    const res = await nhost.functions.post(path, payload);
    return res.body;
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}
