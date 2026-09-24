#!/usr/bin/env node
/**
 * Jalankan fail SQL ke pangkalan data Nhost melalui Hasura (/v2/query run_sql).
 *
 * Guna:
 *   node --env-file=.env scripts/apply-sql.mjs nhost/migrations/default/1758700000000_init_janapai/up.sql
 *   node --env-file=.env scripts/apply-sql.mjs --check      # uji sambungan & senarai jadual public
 */
import { readFileSync } from 'node:fs';

const { NHOST_SUBDOMAIN, NHOST_REGION, NHOST_ADMIN_SECRET, HASURA_URL } = process.env;
const baseUrl = HASURA_URL
  ?? (NHOST_SUBDOMAIN && NHOST_REGION ? `https://${NHOST_SUBDOMAIN}.hasura.${NHOST_REGION}.nhost.run` : null);

if (!baseUrl || !NHOST_ADMIN_SECRET) {
  console.error('Sila tetapkan NHOST_ADMIN_SECRET dan sama ada HASURA_URL atau NHOST_SUBDOMAIN + NHOST_REGION dalam .env');
  process.exit(1);
}

async function runSql(sql) {
  const res = await fetch(`${baseUrl}/v2/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': NHOST_ADMIN_SECRET },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql, cascade: false, read_only: false } }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${body.error ?? res.statusText}${body.internal?.error?.message ? ' — ' + body.internal.error.message : ''}`);
  return body;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Beri laluan fail SQL, atau --check');
  process.exit(1);
}

try {
  if (arg === '--check') {
    const r = await runSql(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1`);
    console.log(`Sambungan OK (${baseUrl}). Jadual public:`, r.result.slice(1).map((row) => row[0]).join(', ') || '(tiada)');
  } else {
    await runSql(readFileSync(arg, 'utf8'));
    console.log(`✔ ${arg} berjaya dijalankan.`);
  }
} catch (err) {
  console.error(`✘ ${err.message}`);
  process.exit(1);
}
