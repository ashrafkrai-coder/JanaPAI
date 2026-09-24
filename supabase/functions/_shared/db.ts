// Akses pangkalan data dari Edge Functions dengan SERVICE ROLE (memintas RLS).
// SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY disediakan secara automatik oleh Supabase kepada
// Edge Functions dan tidak pernah dihantar ke pelayar. Oleh kerana RLS dipintas, setiap
// input MESTI disahkan dalam function sebelum digunakan.
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { HttpError } from './http.ts';

let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new HttpError(500, 'تتڤن ڤلاين: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY تيدق دتتڤکن.');
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

/** Pulangkan `data` atau baling ralat yang boleh dibaca. */
export function semak<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(`DB: ${res.error.message}`);
  return res.data;
}

/** Had bilangan penjanaan AI sejam bagi seluruh panitia (kawalan kos Gemini). */
export async function semakHadPenjanaan(): Promise<void> {
  const had = Number(Deno.env.get('HAD_JANA_SEJAM') ?? 60);
  const sejamLalu = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await db()
    .from('soalan_dijana_log')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sejamLalu);
  if (error) throw new Error(`DB: ${error.message}`);
  if ((count ?? 0) >= had) {
    throw new HttpError(429, `حد ${had} ڤنجاناءن سجم تله دچاڤاي. سيلا چوبا سبنتر لاݢي.`);
  }
}

export async function simpanLog(jenis: 'soalan' | 'rpt', parameter: unknown, hasil: unknown): Promise<string | null> {
  const { data, error } = await db()
    .from('soalan_dijana_log')
    .insert({ jenis, parameter_carian: parameter, hasil_soalan_json: hasil })
    .select('id')
    .single();
  if (error) {
    // Kegagalan log tidak sepatutnya membuang hasil AI yang sudah dibayar.
    console.error('Gagal menyimpan log:', error);
    return null;
  }
  return data.id;
}
