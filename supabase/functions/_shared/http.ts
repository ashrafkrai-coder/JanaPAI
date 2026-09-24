// Pembalut handler Edge Function: CORS, kaedah POST, token panitia dan format ralat seragam.
// Folder bermula dengan "_" tidak di-deploy sebagai function oleh Supabase.
import { tokenSah } from './token.ts';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface Ctx {
  body: Record<string, unknown>;
}

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('CORS_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' } });

/**
 * @param opts.awam true = tidak perlukan token panitia (hanya untuk function `masuk`).
 */
export function postHandler(fn: (ctx: Ctx) => Promise<unknown>, opts: { awam?: boolean } = {}) {
  Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (req.method !== 'POST') return json(405, { message: 'ݢوناکن قاعده POST.' });

    try {
      // Semak token sebelum sebarang kos AI atau akses pangkalan data.
      if (!opts.awam && !tokenSah(req.headers.get('authorization') ?? undefined)) {
        throw new HttpError(401, 'سيلا ماسوقکن کات لالوان ڤانيتيا.');
      }
      const body = await req.json().catch(() => ({}));
      return json(200, await fn({ body: typeof body === 'object' && body !== null ? body : {} }));
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      if (status >= 500) console.error(err);
      // Punca teknikal disertakan (tiada rahsia di dalamnya) supaya panitia boleh melaporkan ralat.
      const punca = (err as Error)?.message?.slice(0, 300) ?? String(err);
      return json(status, {
        message: err instanceof HttpError ? err.message : `رالت دالمن ڤلاين. سيلا چوبا لاݢي. (${punca})`,
      });
    }
  });
}

// --- Pengesahan input ringkas -------------------------------------------------

export function intInRange(value: unknown, min: number, max: number, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new HttpError(400, `${name} مستي اينتيݢر انتارا ${min} دان ${max}.`);
  }
  return n;
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], name: string): T {
  if (!allowed.includes(value as T)) {
    throw new HttpError(400, `${name} مستي ساله ساتو درڤد: ${allowed.join('، ')}.`);
  }
  return value as T;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function uuid(value: unknown, name: string): string {
  if (typeof value !== 'string' || !UUID_RE.test(value)) throw new HttpError(400, `${name} تيدق صح.`);
  return value;
}

/** Teks wajib dengan had panjang. */
export function teks(value: unknown, max: number, name: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new HttpError(400, `${name} تيدق صح.`);
  }
  return value;
}
