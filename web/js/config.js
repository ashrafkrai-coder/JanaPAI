// Tetapan projek Supabase anda (Dashboard > Project Settings > API > Project URL).
// Nilai ini bukan rahsia — ia selamat berada di frontend. Tiada kunci diperlukan di sini:
// pelayar hanya memanggil Edge Functions menggunakan token panitia.
// Kunci Gemini & service role TIDAK diletakkan di sini; ia hanya wujud di Edge Functions.
export const SUPABASE_URL = 'https://dgwzprjwqhmqkqkemjeb.supabase.co'; // tempatan: 'http://127.0.0.1:54321'

// Kumpulan takwim lalai: 'A' (Johor, Kedah, Kelantan, Terengganu) atau 'B' (negeri lain).
export const KUMPULAN_TAKWIM_LALAI = 'B';
