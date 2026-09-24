// Akses Hasura dari dalam function menggunakan ADMIN SECRET (aplikasi tanpa log masuk).
// NHOST_ADMIN_SECRET & NHOST_GRAPHQL_URL disediakan secara automatik oleh Nhost kepada functions
// dan tidak pernah dihantar ke pelayar. Oleh kerana kebenaran Hasura dipintas, setiap
// input MESTI disahkan dalam function sebelum digunakan (lihat http.ts).
import { HttpError } from './http';

export async function hasuraAdmin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.NHOST_GRAPHQL_URL;
  const secret = process.env.NHOST_ADMIN_SECRET;
  if (!url || !secret) throw new Error('NHOST_GRAPHQL_URL / NHOST_ADMIN_SECRET tidak ditetapkan');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': secret },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`Hasura: ${json.errors[0].message}`);
  return json.data as T;
}

/** Had bilangan penjanaan AI sejam bagi SEMUA pelawat (kawalan kos Gemini — tiada log masuk). */
export async function semakHadPenjanaan(): Promise<void> {
  const had = Number(process.env.HAD_JANA_SEJAM ?? 60);
  const sejamLalu = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const data = await hasuraAdmin<{ soalan_dijana_log_aggregate: { aggregate: { count: number } } }>(
    `query HadJana($sejak: timestamptz!) {
      soalan_dijana_log_aggregate(where: { created_at: { _gte: $sejak } }) { aggregate { count } }
    }`,
    { sejak: sejamLalu },
  );
  if (data.soalan_dijana_log_aggregate.aggregate.count >= had) {
    throw new HttpError(429, `حد ${had} ڤنجاناءن سجم تله دچاڤاي. سيلا چوبا سبنتر لاݢي.`);
  }
}

export async function simpanLog(jenis: 'soalan' | 'rpt', parameter: unknown, hasil: unknown): Promise<string | null> {
  try {
    const data = await hasuraAdmin<{ insert_soalan_dijana_log_one: { id: string } }>(
      `mutation Log($obj: soalan_dijana_log_insert_input!) {
        insert_soalan_dijana_log_one(object: $obj) { id }
      }`,
      { obj: { jenis, parameter_carian: parameter, hasil_soalan_json: hasil } },
    );
    return data.insert_soalan_dijana_log_one.id;
  } catch (err) {
    // Kegagalan log tidak sepatutnya membuang hasil AI yang sudah dibayar.
    console.error('Gagal menyimpan log:', err);
    return null;
  }
}
