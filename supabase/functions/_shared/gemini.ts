// Modul Google Gemini untuk JanaPAI.
//   Fungsi A — janaRptAI():    menyusun cadangan RPT daripada takwim + tajuk DSKP.
//   Fungsi B — janaSoalanAI(): menjana soalan Pendidikan Islam KSSM dalam JSON yang sah.
//
// Modul ini tidak bergantung pada pangkalan data: ia menerima data biasa dan memulangkan
// data yang telah disahkan.
import { ApiError, GoogleGenAI } from 'npm:@google/genai@2';
import { HttpError } from './http.ts';

// Gemini 3.x: Google mengesyorkan temperature/top_p/top_k lalai — jangan tetapkan.
const MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.5-flash';

let client: GoogleGenAI | null = null;
function ai(): GoogleGenAI {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new HttpError(500, 'تتڤن ڤلاين: GEMINI_API_KEY تيدق دتتڤکن.');
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

// =============================================================================
// Jenis data
// =============================================================================

export const BIDANG = ['Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak'] as const;
export const ARAS = ['Rendah', 'Sederhana', 'Tinggi', 'KBAT'] as const;
export const JENIS = ['Objektif', 'Subjektif'] as const;
export type Aras = (typeof ARAS)[number];
export type Jenis = (typeof JENIS)[number];

export interface TajukDskp {
  id: string;
  tingkatan: number;
  bidang: string;
  tajuk: string;
  standard_kandungan: string;
  standard_pembelajaran: string;
  /** Tafsiran TP1-TP6 (indeks 0 = TP1). */
  standard_prestasi: string[] | null;
  objektif_pembelajaran: string | null;
}

export interface MingguTakwim {
  minggu_ke: number;
  tarikh_mula: string;
  tarikh_tamat: string;
  minggu_pdp: boolean;
  catatan: string | null;
}

export interface Soalan {
  jenis_soalan: Jenis;
  aras_kognitif: Aras;
  soalan: string;
  pilihan_jawapan: { A: string; B: string; C: string; D: string } | null;
  jawapan_betul: 'A' | 'B' | 'C' | 'D' | null;
  /** Objektif: "Jawapan: X" + penjelasan. Subjektif: skema pemarkahan terperinci. */
  skema_jawapan: string;
  markah: number;
  elemen_kbat: string | null;
  /** Tahap Penguasaan yang diuji (1-6), jika DSKP ada Standard Prestasi. */
  tahap_penguasaan: number | null;
}

export interface BarisRpt {
  minggu_ke: number;
  tarikh_mula: string;
  tarikh_tamat: string;
  tajuk_id: string | null;
  catatan_aktiviti: string;
}

// =============================================================================
// Panggilan Gemini (JSON berstruktur + cuba semula sekali jika JSON rosak)
// =============================================================================

async function generateJson<T>(opts: {
  systemInstruction: string;
  prompt: string;
  schema: object;
}): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await ai().models.generateContent({
        model: MODEL,
        contents: opts.prompt,
        config: {
          systemInstruction: opts.systemInstruction,
          responseMimeType: 'application/json',
          responseJsonSchema: opts.schema,
        },
      });
      const text = res.text;
      if (!text) throw new Error(`Gemini tidak memulangkan teks (finishReason: ${res.candidates?.[0]?.finishReason})`);
      return JSON.parse(text) as T;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) throw new HttpError(429, 'کوٴوتا Gemini API تله هابيس. سيلا چوبا سبنتر لاݢي.');
        if (err.status >= 400 && err.status < 500) throw new Error(`Gemini API ${err.status}: ${err.message}`);
      }
      lastError = err; // JSON rosak / ralat 5xx sementara → cuba sekali lagi
    }
  }
  throw new HttpError(502, `ڤنجان AI ݢاݢل ممولڠکن حاصيل يڠ صح. (${(lastError as Error)?.message})`);
}

// =============================================================================
// Tulisan Jawi — semua teks untuk murid/guru dipulangkan dalam Jawi
// =============================================================================

const ARAHAN_JAWI = `
TULISAN (WAJIB)
- SEMUA teks yang anda pulangkan (soalan, pilihan jawapan, penjelasan, skema, catatan, nota)
  MESTI ditulis dalam TULISAN JAWI mengikut Pedoman Umum Ejaan Jawi (DBP), seperti dalam DSKP
  dan buku teks Pendidikan Islam KSSM. JANGAN gunakan tulisan Rumi untuk ayat Bahasa Melayu.
- Guna huruf Jawi khusus: ڤ (pa), ڠ (nga), ݢ (ga), چ (ca), ڽ (nya), ۏ (va).
  Contoh: ڤنديديقن إسلام، ممباچ، مڽاتاکن، ڤڠاجرن، کهيدوڤن، سباݢاي، برادب دان استقامة.
- Perkataan pinjaman Arab dieja mengikut ejaan asal Arab: صلاة، عبادة، اخلاق، حکوم، فقه، علمو.
- Kekalkan dalam bentuk asal: angka (1, 2, 3), huruf pilihan (A, B, C, D) dan akronim
  seperti KBAT, PdP, PBD, TP1–TP6, PAK21, EMK.
- Singkatan: الله ﷻ، رسول الله ﷺ، نبي محمد ﷺ، عليه السلام، رضي الله عنه.
- Nilai medan enum dalam skema JSON (cth aras_kognitif) kekal seperti yang disenaraikan.
`.trim();

// =============================================================================
// FUNGSI B — Jana Soalan KSSM
// =============================================================================

const SYSTEM_SOALAN = `
Anda ialah Guru Cemerlang Pendidikan Islam dan penggubal item peperiksaan (PT3/SPM) yang
berpengalaman di bawah Kurikulum Standard Sekolah Menengah (KSSM), Kementerian Pendidikan Malaysia.

${ARAHAN_JAWI}

GAYA BAHASA
- Bahasa Melayu baku dan formal, sesuai dengan tahap murid Tingkatan yang dinyatakan.
- Gunakan istilah Pendidikan Islam yang lazim dalam buku teks KSSM (cth: صلاة، وضوء، عقيدة،
  شريعة، مکلف، سنة مؤکد، رسول الله ﷺ، الله ﷻ، صحابة رضي الله عنهم).
- Teks Arab (ayat al-Quran/hadis/doa) hanya jika perlu, dengan baris yang lengkap, dan sentiasa
  disertakan maksudnya dalam Bahasa Melayu tulisan Jawi.

ARAS KOGNITIF (Taksonomi Bloom semakan)
- Rendah: mengingat dan memahami (nyatakan, senaraikan, apakah maksud).
- Sederhana: mengaplikasi dan menganalisis (jelaskan, bezakan, huraikan).
- Tinggi: menilai (wajarkan, pada pendapat anda, nilaikan).
- KBAT: soalan berasaskan situasi/rangsangan kehidupan sebenar yang memerlukan murid
  menganalisis, menilai atau mencipta penyelesaian. Masukkan elemen kemampanan dan nilai
  murni (cth: amalan di rumah, sekolah, masyarakat, media sosial, alam sekitar).

KETEPATAN SYARAK (WAJIB)
- Kandungan mesti selaras dengan Ahli Sunnah Wal Jamaah dan mazhab Syafie seperti diajar di KSSM.
- JANGAN mereka ayat al-Quran, hadis, perawi atau nombor ayat. Petik hanya nas yang masyhur dan
  anda pasti ketepatannya (sebut nama surah dan nombor ayat / perawi). Jika tidak pasti, gunakan
  maksud umum tanpa menyatakan sumber khusus.
- Soalan mesti berdasarkan Standard Kandungan dan Standard Pembelajaran yang diberikan sahaja.

SOALAN OBJEKTIF
- Tepat empat pilihan A, B, C, D; hanya SATU jawapan betul; pengganggu munasabah dan homogen.
- Elakkan "Semua di atas" / "Tiada di atas". Taburkan jawapan betul secara rawak antara A-D.
- "penjelasan" menerangkan mengapa jawapan itu betul dan mengapa pengganggu utama salah.

SOALAN SUBJEKTIF
- Nyatakan markah dalam soalan, cth: "(4 مارکه)".
- "skema_jawapan" disusun dalam bentuk titik, setiap titik dengan markah, cth:
  "1. ... (1م)\n2. ... (1م)". Sertakan "تريما جواڤن لاءين يڠ منسابه" bagi aras Tinggi/KBAT.

Pulangkan JSON sahaja, mengikut skema yang diberikan.
`.trim();

function schemaSoalan(jenis: Jenis, arasDibenarkan: readonly Aras[], bilangan: number): object {
  const common = {
    soalan: { type: 'string', description: 'Teks soalan penuh (termasuk situasi/rangsangan bagi KBAT)' },
    aras_kognitif: { type: 'string', enum: arasDibenarkan },
    markah: { type: 'integer', minimum: 1, maximum: 12 },
    elemen_kbat: { type: 'string', description: 'Kemahiran KBAT/elemen mampan yang diuji; kosong jika tiada' },
    tahap_penguasaan: { type: 'integer', minimum: 1, maximum: 6, description: 'TP (1-6) yang diuji mengikut Standard Prestasi' },
  };
  const item =
    jenis === 'Objektif'
      ? {
          type: 'object',
          properties: {
            ...common,
            pilihan_jawapan: {
              type: 'object',
              properties: { A: { type: 'string' }, B: { type: 'string' }, C: { type: 'string' }, D: { type: 'string' } },
              required: ['A', 'B', 'C', 'D'],
            },
            jawapan_betul: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
            penjelasan: { type: 'string' },
          },
          required: ['soalan', 'aras_kognitif', 'pilihan_jawapan', 'jawapan_betul', 'penjelasan', 'markah'],
        }
      : {
          type: 'object',
          properties: {
            ...common,
            skema_jawapan: { type: 'string', description: 'Skema pemarkahan terperinci dengan markah bagi setiap titik' },
          },
          required: ['soalan', 'aras_kognitif', 'skema_jawapan', 'markah'],
        };

  return {
    type: 'object',
    properties: { soalan: { type: 'array', minItems: bilangan, maxItems: bilangan, items: item } },
    required: ['soalan'],
  };
}

/** Blok teks "Standard Prestasi" untuk prompt (kosong jika tiada data TP). */
function senaraiTp(dskp: TajukDskp): string {
  if (!dskp.standard_prestasi?.length) return '';
  return 'Standard Prestasi (Tahap Penguasaan):\n' + dskp.standard_prestasi.map((t, i) => `TP${i + 1}: ${t}`).join('\n');
}

export interface JanaSoalanInput {
  dskp: TajukDskp;
  aras: Aras | 'Campuran';
  jenis: Jenis;
  bilangan: number;
}

export async function janaSoalanAI({ dskp, aras, jenis, bilangan }: JanaSoalanInput): Promise<Soalan[]> {
  const arasDibenarkan = aras === 'Campuran' ? ARAS : ([aras] as const);
  const arahanAras =
    aras === 'Campuran'
      ? 'Campurkan aras dengan nisbah lebih kurang 5:3:2 (Rendah : Sederhana : Tinggi/KBAT).'
      : `Semua soalan mestilah pada aras ${aras}.`;

  const prompt = `
Jana TEPAT ${bilangan} soalan ${jenis.toUpperCase()} Pendidikan Islam.

Tingkatan: ${dskp.tingkatan}
Bidang: ${dskp.bidang}
Tajuk: ${dskp.tajuk}
Standard Kandungan: ${dskp.standard_kandungan}
Standard Pembelajaran:
${dskp.standard_pembelajaran}
${senaraiTp(dskp)}
${dskp.objektif_pembelajaran ? `Objektif Pembelajaran: ${dskp.objektif_pembelajaran}` : ''}

${arahanAras}
Pastikan setiap soalan menguji Standard Pembelajaran yang berbeza sekiranya boleh, dan tiada soalan berulang.
${dskp.standard_prestasi ? `Selaraskan setiap soalan dengan Standard Prestasi di atas dan isi "tahap_penguasaan" dengan TP yang diuji
(panduan: Rendah ≈ TP1-TP2, Sederhana ≈ TP3-TP4, Tinggi ≈ TP5, KBAT ≈ TP5-TP6).` : ''}
`.trim();

  type Raw = {
    soalan: {
      soalan: string; aras_kognitif: string; markah: number; elemen_kbat?: string; tahap_penguasaan?: number;
      pilihan_jawapan?: Record<string, string>; jawapan_betul?: string; penjelasan?: string; skema_jawapan?: string;
    }[];
  };

  const raw = await generateJson<Raw>({
    systemInstruction: SYSTEM_SOALAN,
    prompt,
    schema: schemaSoalan(jenis, arasDibenarkan, bilangan),
  });

  // Sahkan semula — jangan percaya output model secara membuta tuli.
  const hasil: Soalan[] = [];
  for (const s of raw.soalan ?? []) {
    const teks = s.soalan?.trim();
    if (!teks || !arasDibenarkan.includes(s.aras_kognitif as Aras)) continue;
    const base = {
      jenis_soalan: jenis,
      aras_kognitif: s.aras_kognitif as Aras,
      soalan: teks,
      markah: Number.isInteger(s.markah) && s.markah > 0 ? s.markah : 1,
      elemen_kbat: s.elemen_kbat?.trim() || null,
      tahap_penguasaan: Number.isInteger(s.tahap_penguasaan) && s.tahap_penguasaan! >= 1 && s.tahap_penguasaan! <= 6
        ? s.tahap_penguasaan! : null,
    };

    if (jenis === 'Objektif') {
      const p = s.pilihan_jawapan ?? {};
      const betul = s.jawapan_betul as Soalan['jawapan_betul'];
      if (!(['A', 'B', 'C', 'D'] as const).every((k) => p[k]?.trim()) || !betul || !'ABCD'.includes(betul)) continue;
      hasil.push({
        ...base,
        pilihan_jawapan: { A: p.A.trim(), B: p.B.trim(), C: p.C.trim(), D: p.D.trim() },
        jawapan_betul: betul,
        skema_jawapan: `جواڤن: ${betul}\n${s.penjelasan?.trim() ?? ''}`.trim(),
      });
    } else {
      if (!s.skema_jawapan?.trim()) continue;
      hasil.push({ ...base, pilihan_jawapan: null, jawapan_betul: null, skema_jawapan: s.skema_jawapan.trim() });
    }
  }

  if (!hasil.length) throw new HttpError(502, 'ڤنجان AI تيدق مڠحاصيلکن سوالن يڠ صح. سيلا چوبا لاݢي.');
  return hasil.slice(0, bilangan);
}

// =============================================================================
// FUNGSI C — Jana Soalan Gaya SPM (Kertas 1223/1, format LP mulai 2021)
// =============================================================================

/** Bidang bagi setiap nombor soalan Kertas 1 (1223/1). */
export const BIDANG_SPM: Record<number, readonly string[]> = {
  1: ['Al-Quran', 'Hadis'],
  2: ['Akidah'],
  3: ['Fiqah'],
  4: ['Sirah'],
  5: ['Akhlak'],
};
export const TULISAN = ['Rumi', 'Jawi'] as const;
export type Tulisan = (typeof TULISAN)[number];
const ARAS_SPM = ['R', 'S', 'T'] as const;
const LABEL_ITEM = ['i', 'ii', 'iii'];

export interface ItemSpm { label: string; soalan: string; markah: number; aras: 'R' | 'S' | 'T'; skema: string }
export interface BahagianSpm { label: string; rangsangan: string | null; tajuk: string | null; item: ItemSpm[] }
export interface SoalanSpm { nombor: number; bahagian: BahagianSpm[]; jumlah_markah: number; nota: string | null }

/** Contoh item percubaan/SPM lepas daripada jadual soalan_percubaan (untuk gaya sahaja). */
export interface ContohSpm { bahagian: string; soalan: string; markah: number | null; skema_jawapan: string }

const ARAHAN_RUMI = `
TULISAN (WAJIB)
- SEMUA teks ditulis dalam Bahasa Melayu tulisan RUMI baku, seperti kertas SPM sebenar.
- Istilah: Allah SWT, Rasulullah SAW, Nabi Muhammad SAW, r.a., a.s.; nama surah seperti buku teks
  (cth: Surah al-Baqarah); istilah Arab mengikut ejaan Rumi lazim buku teks (solat, wuduk, akidah).
- Maklumat DSKP yang diberikan ditulis dalam Jawi — fahami dan tulis semula dalam Rumi.
`.trim();

function systemSpm(tulisan: Tulisan): string {
  return `
Anda ialah penggubal item berpengalaman bagi peperiksaan SPM Pendidikan Islam (1223), Lembaga
Peperiksaan, Kementerian Pendidikan Malaysia, mengikut Format Pentaksiran KSSM mulai 2021.

${tulisan === 'Jawi' ? ARAHAN_JAWI : ARAHAN_RUMI}

FORMAT KERTAS 1 (1223/1)
- 5 soalan, setiap satu 20 markah (jumlah 100), jawab semua. Soalan 1: al-Quran dan Hadis;
  Soalan 2: Akidah; Soalan 3: Ibadah/Fiqah; Soalan 4: Sirah dan Tamadun Islam; Soalan 5: Akhlak.
- Jenis item: subjektif respons terhad, respons terbuka dan berstruktur.
- Anda menjana SATU soalan: TEPAT tiga bahagian (a), (b), (c); setiap bahagian 1–3 item (i), (ii), (iii).
- JUMLAH MARKAH SOALAN MESTI TEPAT 20. Setiap item bernilai 2 atau 4 markah. Pola lazim:
  (a) 8 markah [2+2+4], (b) 6 markah [2+4], (c) 6 markah [2+4]; atau (a) 8, (b) 4, (c) 8.
- Setiap bahagian menguji tajuk DSKP yang BERBEZA (pilih daripada senarai tajuk yang diberi),
  sebaik-baiknya merangkumi Tingkatan 4 dan Tingkatan 5.

ARAS KESUKARAN (nisbah markah Rendah : Sederhana : Tinggi = 5 : 3 : 2, iaitu ±10 : 6 : 4 markah)
- R (mengingat/memahami): Nyatakan, Senaraikan, Apakah maksud ...
- S (mengaplikasi/menganalisis): Jelaskan, Terangkan, Huraikan, Bezakan ...
- T (menilai): Wajarkan, Bagaimanakah anda ..., Pada pendapat anda ..., Cadangkan ...
  Item T biasanya berasaskan situasi kehidupan murid (rumah, sekolah, masyarakat, media sosial).

RANGSANGAN
- Soalan 1: bahagian (a) dan (b) berasaskan ayat al-Quran, (c) berasaskan hadis — HANYA ayat/hadis
  yang tersenarai dalam tajuk DSKP yang diberi. Tulis rangsangan dalam bentuk:
  "Firman Allah SWT:\\n[Teks ayat — Surah <nama>: <nombor ayat>]\\nAyat di atas menjelaskan <tema>.\\nBerdasarkan ayat di atas,"
  atau "Sabda Rasulullah SAW:\\n[Teks hadis — riwayat <perawi>]\\nHadis di atas menjelaskan <tema>.\\nBerdasarkan hadis di atas,"
  JANGAN tulis teks Arab dan JANGAN tulis terjemahan penuh — guru akan menyalin nas daripada mushaf/buku teks.
- Soalan 2–5: rangsangan ialah satu pernyataan ringkas atau situasi (cth: "Wasatiah menjamin kecemerlangan
  umat."), atau kosong jika item boleh berdiri sendiri.

KETEPATAN SYARAK (WAJIB)
- Selaras dengan Ahli Sunnah Wal Jamaah dan mazhab Syafie seperti diajar dalam KSSM.
- JANGAN mereka nas, perawi, nombor ayat, tarikh atau fakta sejarah. Jika tidak pasti, jangan gunakan.
- Isi soalan dan skema mesti dalam cakupan Standard Kandungan/Pembelajaran yang diberi.

SKEMA PEMARKAHAN (setiap item)
- Senarai isi bernombor dengan markah, cth: "1. ... (1m)\\n2. ... (1m)". Item 4 markah "Jelaskan dua ..."
  = 2 isi × (isi 1m + huraian 1m). Berikan lebih banyak isi daripada yang diperlukan dan tulis
  "Mana-mana dua" / "Mana-mana empat". Item aras T: tambah "Terima jawapan lain yang munasabah."

Pulangkan JSON sahaja, mengikut skema yang diberikan.
`.trim();
}

const SCHEMA_SPM = {
  type: 'object',
  properties: {
    bahagian: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object',
        properties: {
          tajuk_ref: { type: 'string', description: 'Rujukan tajuk DSKP yang diuji, cth "D3"' },
          rangsangan: { type: 'string', description: 'Pernyataan/situasi/rujukan nas pendahuluan; kosong jika tiada' },
          item: {
            type: 'array', minItems: 1, maxItems: 3,
            items: {
              type: 'object',
              properties: {
                soalan: { type: 'string' },
                markah: { type: 'integer', minimum: 1, maximum: 8 },
                aras: { type: 'string', enum: ARAS_SPM },
                skema: { type: 'string' },
              },
              required: ['soalan', 'markah', 'aras', 'skema'],
            },
          },
        },
        required: ['tajuk_ref', 'rangsangan', 'item'],
      },
    },
  },
  required: ['bahagian'],
};

export interface JanaSpmInput {
  nombor: number;
  tulisan: Tulisan;
  /** Tajuk DSKP T4/T5 yang boleh diuji (sudah ditapis mengikut bidang soalan). */
  tajuk: TajukDskp[];
  contoh: ContohSpm[];
}

export async function janaSpmAI({ nombor, tulisan, tajuk, contoh }: JanaSpmInput): Promise<SoalanSpm> {
  const refKeTajuk = new Map(tajuk.map((t, i) => [`D${i + 1}`, t]));
  const senaraiTajuk = tajuk
    .map((t, i) => `D${i + 1} | Tingkatan ${t.tingkatan} | ${t.bidang} | ${t.tajuk}\n   SK: ${t.standard_kandungan}\n   SP: ${t.standard_pembelajaran.replace(/\n/g, '; ')}`)
    .join('\n');
  const senaraiContoh = contoh
    .map((c) => `- [${c.bahagian}, ${c.markah ?? '?'} markah] ${c.soalan}\n  Skema: ${c.skema_jawapan}`)
    .join('\n');

  const prompt = `
Jana SOALAN ${nombor} (${BIDANG_SPM[nombor].join(' dan ')}) Kertas 1 SPM Pendidikan Islam, 20 markah.

TAJUK DSKP YANG BOLEH DIUJI (${tajuk.length}):
${senaraiTajuk}
${senaraiContoh ? `
CONTOH ITEM PERCUBAAN NEGERI / SPM LEPAS (rujukan gaya dan kata tugas sahaja — JANGAN salin bulat-bulat):
${senaraiContoh}` : ''}
`.trim();

  let nota: string | null = null;
  for (let cubaan = 1; cubaan <= 2; cubaan++) {
    const raw = await generateJson<{
      bahagian: { tajuk_ref: string; rangsangan: string; item: { soalan: string; markah: number; aras: string; skema: string }[] }[];
    }>({
      systemInstruction: systemSpm(tulisan),
      prompt: cubaan === 1 ? prompt : `${prompt}\n\nPERINGATAN: jumlah markah semua item MESTI tepat 20.`,
      schema: SCHEMA_SPM,
    });

    // Sahkan semula dan labelkan (a)(b)(c) / (i)(ii)(iii) mengikut kedudukan.
    const bahagian: BahagianSpm[] = (raw.bahagian ?? []).slice(0, 3).map((b, bi) => ({
      label: 'abc'[bi],
      rangsangan: b.rangsangan?.trim() || null,
      tajuk: refKeTajuk.get(b.tajuk_ref?.trim())?.tajuk ?? null,
      item: (b.item ?? [])
        .filter((it) => it.soalan?.trim() && it.skema?.trim() && ARAS_SPM.includes(it.aras as 'R'))
        .slice(0, 3)
        .map((it, ii) => ({
          label: LABEL_ITEM[ii],
          soalan: it.soalan.trim(),
          markah: Number.isInteger(it.markah) && it.markah >= 1 && it.markah <= 8 ? it.markah : 2,
          aras: it.aras as ItemSpm['aras'],
          skema: it.skema.trim(),
        })),
    })).filter((b) => b.item.length);

    const jumlah = bahagian.reduce((n, b) => n + b.item.reduce((m, it) => m + it.markah, 0), 0);
    if (bahagian.length === 3 && jumlah === 20) return { nombor, bahagian, jumlah_markah: jumlah, nota: null };
    if (cubaan === 2 && bahagian.length) {
      nota = `Jumlah markah ${jumlah} (sepatutnya 20) — sila laraskan sebelum digunakan.`;
      return { nombor, bahagian, jumlah_markah: jumlah, nota };
    }
  }
  throw new HttpError(502, 'ڤنجان AI تيدق مڠحاصيلکن سوالن SPM يڠ صح. سيلا چوبا لاݢي.');
}

// =============================================================================
// FUNGSI A — Jana RPT
// =============================================================================

const SYSTEM_RPT = `
Anda ialah Ketua Panitia Pendidikan Islam sekolah menengah yang pakar menyediakan
Rancangan Pengajaran Tahunan (RPT) mengikut format KSSM, Kementerian Pendidikan Malaysia.

${ARAHAN_JAWI}

PERATURAN PENYUSUNAN
1. Gunakan HANYA minggu dan rujukan tajuk (T1, T2, ...) yang diberikan. Jangan cipta tajuk baharu.
2. Minggu bertanda "BUKAN PdP" (cuti, peperiksaan, program khas) TIDAK boleh diberi tajuk;
   pulangkan "tajuk" sebagai senarai kosong dan catatan yang sesuai (cth: "چوتي ڤڠݢل 1").
3. Susun tajuk mengikut urutan senarai yang diberikan (urutan DSKP). Setiap tajuk mesti
   dijadualkan sekurang-kurangnya sekali.
4. Agihkan masa secara munasabah: tajuk dengan lebih banyak Standard Pembelajaran diberi
   lebih banyak minggu. Satu minggu boleh mengandungi lebih daripada satu tajuk yang pendek.
5. Jika minggu PdP berbaki selepas semua tajuk selesai, gunakan untuk "اولڠ کاجي",
   "ڤنتقسيرن بيليق دارجه (PBD)" atau "ڤڠوکوهن" (tajuk kosong).
6. "catatan_aktiviti" ditulis ringkas dalam Bahasa Melayu tulisan Jawi mengikut format RPT KSSM:
   "اکتيۏيتي: ... | PAK21: ... | EMK: ... | PBD: TP..."
   - PAK21: nama teknik boleh kekal dalam bahasa asal (cth Think-Pair-Share, Gallery Walk).
   - EMK (Elemen Merentas Kurikulum): cth نيلاي موروني، کرياتيۏيتي دان اينوۏاسي، TMK،
     کلستارين ݢلوبل، کأوسهاوانن، بهاس.
   - PBD: tahap penguasaan yang disasarkan (TP1-TP6), dipilih daripada Standard Prestasi tajuk
     itu (jika diberi) dan sesuai dengan aktiviti minggu tersebut.

Pulangkan JSON sahaja, mengikut skema yang diberikan.
`.trim();

const SCHEMA_RPT = {
  type: 'object',
  properties: {
    minggu: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          minggu_ke: { type: 'integer' },
          tajuk: { type: 'array', items: { type: 'string', description: 'Rujukan tajuk, cth "T3"' } },
          catatan_aktiviti: { type: 'string' },
        },
        required: ['minggu_ke', 'tajuk', 'catatan_aktiviti'],
      },
    },
    nota: { type: 'string', description: 'Ulasan ringkas tentang agihan masa dalam tulisan Jawi (maksimum 3 ayat)' },
  },
  required: ['minggu', 'nota'],
};

export interface JanaRptInput {
  tingkatan: number;
  takwim: MingguTakwim[];
  /** Tajuk DSKP yang belum diajar, dalam urutan silibus. */
  tajuk: TajukDskp[];
}

export interface JanaRptOutput {
  baris: BarisRpt[];
  /** Tajuk yang tidak dijadualkan oleh AI (perlu disemak guru). */
  tajuk_tertinggal: string[];
  nota: string;
}

export async function janaRptAI({ tingkatan, takwim, tajuk }: JanaRptInput): Promise<JanaRptOutput> {
  // Rujukan pendek (T1, T2 ...) menggantikan UUID: lebih jimat token dan model tidak "tersalah salin" ID.
  const refKeId = new Map(tajuk.map((t, i) => [`T${i + 1}`, t.id]));
  const mingguMap = new Map(takwim.map((m) => [m.minggu_ke, m]));

  const senaraiMinggu = takwim
    .map((m) => `Minggu ${m.minggu_ke} (${m.tarikh_mula} hingga ${m.tarikh_tamat})` +
      (m.minggu_pdp ? '' : ' — BUKAN PdP') + (m.catatan ? ` — ${m.catatan}` : ''))
    .join('\n');

  const senaraiTajuk = tajuk
    .map((t, i) => `T${i + 1} | ${t.bidang} | ${t.tajuk}\n   SK: ${t.standard_kandungan}\n   SP: ${t.standard_pembelajaran.replace(/\n/g, '; ')}` +
      (t.standard_prestasi ? `\n   TP: ${t.standard_prestasi.map((x, j) => `TP${j + 1} ${x}`).join(' | ')}` : ''))
    .join('\n');

  const prompt = `
Susun RPT Pendidikan Islam Tingkatan ${tingkatan}.

TAKWIM (${takwim.length} minggu):
${senaraiMinggu}

TAJUK DSKP YANG BELUM DIAJAR (${tajuk.length} tajuk, mengikut urutan):
${senaraiTajuk}

Pulangkan satu entri bagi SETIAP minggu dalam takwim.
`.trim();

  const raw = await generateJson<{
    minggu: { minggu_ke: number; tajuk: string[]; catatan_aktiviti: string }[];
    nota: string;
  }>({ systemInstruction: SYSTEM_RPT, prompt, schema: SCHEMA_RPT });

  // Sahkan & normalkan: minggu mesti wujud dalam takwim, ref mesti sah,
  // minggu bukan PdP tidak boleh bertajuk, dan setiap minggu takwim mesti ada.
  const ikutMinggu = new Map<number, { refs: string[]; catatan: string }>();
  for (const m of raw.minggu ?? []) {
    const minggu = mingguMap.get(m.minggu_ke);
    if (!minggu || ikutMinggu.has(m.minggu_ke)) continue;
    const refs = minggu.minggu_pdp ? [...new Set((m.tajuk ?? []).filter((r) => refKeId.has(r)))] : [];
    ikutMinggu.set(m.minggu_ke, { refs, catatan: m.catatan_aktiviti?.trim() ?? '' });
  }

  const baris: BarisRpt[] = [];
  const dijadualkan = new Set<string>();
  for (const m of takwim) {
    const r = ikutMinggu.get(m.minggu_ke) ?? { refs: [], catatan: m.catatan ?? '' };
    const asas = { minggu_ke: m.minggu_ke, tarikh_mula: m.tarikh_mula, tarikh_tamat: m.tarikh_tamat };
    if (!r.refs.length) {
      baris.push({ ...asas, tajuk_id: null, catatan_aktiviti: r.catatan || (m.minggu_pdp ? 'اولڠ کاجي / PBD' : m.catatan ?? 'تياد PdP') });
      continue;
    }
    for (const ref of r.refs) {
      const id = refKeId.get(ref)!;
      dijadualkan.add(id);
      baris.push({ ...asas, tajuk_id: id, catatan_aktiviti: r.catatan });
    }
  }

  return {
    baris,
    tajuk_tertinggal: tajuk.filter((t) => !dijadualkan.has(t.id)).map((t) => t.id),
    nota: raw.nota?.trim() ?? '',
  };
}
