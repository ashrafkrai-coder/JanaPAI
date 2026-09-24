#!/usr/bin/env node
/**
 * Daftar (track) jadual JanaPAI, hubungan dan kebenaran role `user` di Hasura.
 *
 * Skrip ini bersifat idempotent: operasi yang sudah wujud akan dilangkau, jadi
 * selamat dijalankan semula. Ia menambah metadata sahaja — tidak menyentuh
 * jadual auth.* / storage.* milik Nhost.
 *
 * Guna:
 *   NHOST_SUBDOMAIN=xxxx NHOST_REGION=ap-southeast-1 NHOST_ADMIN_SECRET=... node scripts/setup-hasura.mjs
 *   # atau untuk Nhost CLI tempatan:
 *   HASURA_URL=https://local.hasura.local.nhost.run NHOST_ADMIN_SECRET=nhost-admin-secret node scripts/setup-hasura.mjs
 */

const { NHOST_SUBDOMAIN, NHOST_REGION, NHOST_ADMIN_SECRET, HASURA_URL } = process.env;

const baseUrl = HASURA_URL
  ?? (NHOST_SUBDOMAIN && NHOST_REGION ? `https://${NHOST_SUBDOMAIN}.hasura.${NHOST_REGION}.nhost.run` : null);

if (!baseUrl || !NHOST_ADMIN_SECRET) {
  console.error('Sila tetapkan NHOST_ADMIN_SECRET dan sama ada HASURA_URL atau NHOST_SUBDOMAIN + NHOST_REGION.');
  process.exit(1);
}

const SOURCE = 'default';
const USER_ID = { _eq: 'X-Hasura-User-Id' };
const OWN = { user_id: USER_ID };
const PRESET_USER = { user_id: 'x-hasura-User-Id' };
const table = (name) => ({ schema: 'public', name });

const ops = [];
const add = (type, args) => ops.push({ type, args: { source: SOURCE, ...args } });

// --- Track jadual ------------------------------------------------------------
for (const name of ['dskp', 'takwim_persekolahan', 'rpt', 'koleksi_soalan', 'soalan_dijana_log']) {
  add('pg_track_table', { table: table(name) });
}

// --- Hubungan ----------------------------------------------------------------
add('pg_create_object_relationship', {
  table: table('rpt'), name: 'dskp', using: { foreign_key_constraint_on: 'tajuk_id' },
});
add('pg_create_array_relationship', {
  table: table('dskp'), name: 'rpts',
  using: { foreign_key_constraint_on: { table: table('rpt'), column: 'tajuk_id' } },
});
add('pg_create_object_relationship', {
  table: table('koleksi_soalan'), name: 'dskp', using: { foreign_key_constraint_on: 'dskp_id' },
});

// --- Kebenaran role `user` ---------------------------------------------------
// DSKP & takwim: baca sahaja (data diurus oleh admin melalui Hasura Console).
add('pg_create_select_permission', {
  table: table('dskp'), role: 'user',
  permission: { columns: '*', filter: {}, allow_aggregations: true },
});
add('pg_create_select_permission', {
  table: table('takwim_persekolahan'), role: 'user',
  permission: { columns: '*', filter: {} },
});

// RPT: setiap guru hanya nampak & ubah RPT sendiri.
add('pg_create_select_permission', {
  table: table('rpt'), role: 'user', permission: { columns: '*', filter: OWN },
});
add('pg_create_insert_permission', {
  table: table('rpt'), role: 'user',
  permission: {
    check: OWN, set: PRESET_USER,
    columns: ['tahun', 'tingkatan', 'minggu_ke', 'tarikh_mula', 'tarikh_tamat', 'tajuk_id', 'catatan_aktiviti'],
  },
});
add('pg_create_update_permission', {
  table: table('rpt'), role: 'user',
  permission: { columns: ['tajuk_id', 'catatan_aktiviti'], filter: OWN, check: OWN },
});
add('pg_create_delete_permission', {
  table: table('rpt'), role: 'user', permission: { filter: OWN },
});

// Bank soalan: milik guru sendiri.
add('pg_create_select_permission', {
  table: table('koleksi_soalan'), role: 'user',
  permission: { columns: '*', filter: OWN, allow_aggregations: true },
});
add('pg_create_insert_permission', {
  table: table('koleksi_soalan'), role: 'user',
  permission: {
    check: OWN, set: PRESET_USER,
    columns: ['dskp_id', 'tingkatan', 'bidang', 'tajuk', 'aras_kognitif', 'jenis_soalan',
      'soalan', 'pilihan_jawapan', 'skema_jawapan'],
  },
});
add('pg_create_update_permission', {
  table: table('koleksi_soalan'), role: 'user',
  permission: {
    columns: ['aras_kognitif', 'soalan', 'pilihan_jawapan', 'skema_jawapan'],
    filter: OWN, check: OWN,
  },
});
add('pg_create_delete_permission', {
  table: table('koleksi_soalan'), role: 'user', permission: { filter: OWN },
});

// Log: ditulis oleh serverless function menggunakan token pengguna; dibaca oleh pemiliknya.
add('pg_create_select_permission', {
  // allow_aggregations: digunakan oleh function untuk mengira had penjanaan sejam.
  table: table('soalan_dijana_log'), role: 'user', permission: { columns: '*', filter: OWN, allow_aggregations: true },
});
add('pg_create_insert_permission', {
  table: table('soalan_dijana_log'), role: 'user',
  permission: { check: OWN, set: PRESET_USER, columns: ['jenis', 'parameter_carian', 'hasil_soalan_json'] },
});

// --- Kebenaran role `panitia` (kata laluan bersama, tiada akaun) ------------
// Token role `panitia` dikeluarkan oleh function `masuk` selepas kata laluan panitia disahkan.
// RPT & bank soalan dikongsi oleh semua ahli panitia. Pelawat tanpa token (role `public`)
// TIDAK diberi sebarang kebenaran. Log penjanaan hanya ditulis oleh function (admin secret).
const RPT_COLS = ['tahun', 'tingkatan', 'minggu_ke', 'tarikh_mula', 'tarikh_tamat', 'tajuk_id', 'catatan_aktiviti'];
const SOALAN_COLS = ['dskp_id', 'tingkatan', 'bidang', 'tajuk', 'aras_kognitif', 'jenis_soalan',
  'soalan', 'pilihan_jawapan', 'skema_jawapan'];

add('pg_create_select_permission', {
  table: table('dskp'), role: 'panitia',
  permission: { columns: '*', filter: {}, allow_aggregations: true },
});
add('pg_create_select_permission', {
  table: table('takwim_persekolahan'), role: 'panitia', permission: { columns: '*', filter: {} },
});
add('pg_create_select_permission', {
  table: table('rpt'), role: 'panitia', permission: { columns: '*', filter: {} },
});
add('pg_create_insert_permission', {
  table: table('rpt'), role: 'panitia', permission: { check: {}, columns: RPT_COLS },
});
add('pg_create_update_permission', {
  table: table('rpt'), role: 'panitia', permission: { columns: ['tajuk_id', 'catatan_aktiviti'], filter: {}, check: {} },
});
add('pg_create_delete_permission', {
  table: table('rpt'), role: 'panitia', permission: { filter: {} },
});
add('pg_create_select_permission', {
  table: table('koleksi_soalan'), role: 'panitia', permission: { columns: '*', filter: {}, allow_aggregations: true },
});
add('pg_create_insert_permission', {
  table: table('koleksi_soalan'), role: 'panitia', permission: { check: {}, columns: SOALAN_COLS },
});
add('pg_create_update_permission', {
  table: table('koleksi_soalan'), role: 'panitia',
  permission: { columns: ['aras_kognitif', 'soalan', 'pilihan_jawapan', 'skema_jawapan'], filter: {}, check: {} },
});
add('pg_create_delete_permission', {
  table: table('koleksi_soalan'), role: 'panitia', permission: { filter: {} },
});

// --- Laksana -----------------------------------------------------------------
let failed = 0;
for (const op of ops) {
  const label = `${op.type} ${op.args.table.name}${op.args.name ? '.' + op.args.name : ''}${op.args.role ? ' [' + op.args.role + ']' : ''}`;
  const res = await fetch(`${baseUrl}/v1/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': NHOST_ADMIN_SECRET },
    body: JSON.stringify(op),
  });
  if (res.ok) {
    console.log(`✔ ${label}`);
    continue;
  }
  const body = await res.json().catch(() => ({}));
  if (/already/i.test(`${body.code} ${body.error}`)) {
    console.log(`• ${label} (sudah wujud)`);
  } else {
    failed++;
    console.error(`✘ ${label}: ${body.error ?? res.statusText}`);
  }
}

if (failed) {
  console.error(`\n${failed} operasi gagal.`);
  process.exit(1);
}
console.log('\nMetadata Hasura siap.');
