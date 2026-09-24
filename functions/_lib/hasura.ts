// Akses Hasura dari dalam function MENGGUNAKAN TOKEN PENGGUNA (bukan admin secret).
// Kesannya: kebenaran role `user` terpakai, token disahkan oleh Hasura, dan
// `user_id` pada log diisi secara automatik oleh column preset.
import { HttpError } from './http';

export async function hasuraAsUser<T>(
  authorization: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const url = process.env.NHOST_GRAPHQL_URL;
  if (!url) throw new Error('NHOST_GRAPHQL_URL tidak ditetapkan');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authorization },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

  if (json.errors?.length) {
    const [first] = json.errors;
    if (first.extensions?.code === 'invalid-jwt' || res.status === 401) {
      throw new HttpError(401, 'Sesi tamat. Sila log masuk semula.');
    }
    throw new Error(`Hasura: ${first.message}`);
  }
  return json.data as T;
}

/** Had bilangan penjanaan AI per pengguna dalam tempoh sejam (kawalan kos Gemini). */
export async function semakHadPenjanaan(authorization: string): Promise<void> {
  const had = Number(process.env.HAD_JANA_SEJAM ?? 30);
  const sejamLalu = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const data = await hasuraAsUser<{ soalan_dijana_log_aggregate: { aggregate: { count: number } } }>(
    authorization,
    `query HadJana($sejak: timestamptz!) {
      soalan_dijana_log_aggregate(where: { created_at: { _gte: $sejak } }) { aggregate { count } }
    }`,
    { sejak: sejamLalu },
  );
  if (data.soalan_dijana_log_aggregate.aggregate.count >= had) {
    throw new HttpError(429, `Had ${had} penjanaan sejam telah dicapai. Sila cuba sebentar lagi.`);
  }
}

export async function simpanLog(
  authorization: string,
  jenis: 'soalan' | 'rpt',
  parameter: unknown,
  hasil: unknown,
): Promise<string | null> {
  try {
    const data = await hasuraAsUser<{ insert_soalan_dijana_log_one: { id: string } }>(
      authorization,
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
