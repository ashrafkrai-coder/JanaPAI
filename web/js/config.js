// Tetapan projek Nhost anda (Nhost Dashboard > Project Settings).
// Nilai ini bukan rahsia — ia selamat berada di frontend.
// Kunci Gemini TIDAK diletakkan di sini; ia hanya wujud di serverless function.
export const NHOST_CONFIG = {
  subdomain: 'GANTI_SUBDOMAIN', // cth: 'abcdefghijklmnop'  (tempatan: 'local')
  region: 'GANTI_REGION',       // cth: 'ap-southeast-1'    (tempatan: 'local')
};

// Kumpulan takwim lalai: 'A' (Johor, Kedah, Kelantan, Terengganu) atau 'B' (negeri lain).
export const KUMPULAN_TAKWIM_LALAI = 'B';
