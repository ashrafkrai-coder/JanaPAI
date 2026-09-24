// Pembalut handler Express untuk Nhost Functions: CORS, kaedah POST, dan format ralat seragam.
// Fail/folder bermula dengan "_" tidak didedahkan sebagai endpoint oleh Nhost.
import type { Request, Response } from 'express';
import { tokenSah } from './token';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface Ctx {
  body: Record<string, unknown>;
}

/**
 * @param opts.awam true = tidak perlukan token panitia (hanya untuk endpoint `masuk`).
 */
export function postHandler(fn: (ctx: Ctx) => Promise<unknown>, opts: { awam?: boolean } = {}) {
  return async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN ?? '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'ݢوناکن قاعده POST.' });

    // Semak token sebelum sebarang kos AI atau akses pangkalan data.
    if (!opts.awam && !tokenSah(req.headers.authorization)) {
      return res.status(401).json({ message: 'سيلا ماسوقکن کات لالوان ڤانيتيا.' });
    }

    try {
      const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
      res.status(200).json(await fn({ body }));
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      if (status >= 500) console.error(err);
      // Punca teknikal disertakan (tiada rahsia di dalamnya) supaya panitia boleh melaporkan ralat.
      const punca = (err as Error)?.message?.slice(0, 300) ?? String(err);
      res.status(status).json({
        message: err instanceof HttpError ? err.message : `رالت دالمن ڤلاين. سيلا چوبا لاݢي. (${punca})`,
      });
    }
  };
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
