// Tetapan projek Nhost anda (Nhost Dashboard > Project Settings).
// Nilai ini bukan rahsia — ia selamat berada di frontend.
// Kunci Gemini TIDAK diletakkan di sini; ia hanya wujud di serverless function.
export const NHOST_CONFIG = {
  subdomain: 'okcgasciukcwhekyluyr', // cth: 'abcdefghijklmnop'  (tempatan: 'local')
  region: 'ap-southeast-1',       // cth: 'ap-southeast-1'    (tempatan: 'local')
};

// Kumpulan takwim lalai: 'A' (Johor, Kedah, Kelantan, Terengganu) atau 'B' (negeri lain).
export const KUMPULAN_TAKWIM_LALAI = 'B';
