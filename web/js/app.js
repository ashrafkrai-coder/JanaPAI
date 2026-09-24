// Logik antara muka JanaPAI (Alpine.js). Semua akses data melalui api.js / nhost.js.
import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.17.4/dist/module.esm.js';
import {
  getDskp, getKoleksiSoalan, getRpt, getTakwim, janaRpt, janaSoalan,
  padamSoalan, simpanRpt, simpanSoalan, toKoleksiRow,
} from './api.js';
import { KUMPULAN_TAKWIM_LALAI } from './config.js';

const BIDANG = ['Al-Quran', 'Hadis', 'Akidah', 'Fiqah', 'Sirah', 'Akhlak'];
const ARAS = ['Rendah', 'Sederhana', 'Tinggi', 'KBAT'];
const TAB = ['soalan', 'rpt', 'bank'];

// Nilai dalaman (kunci pangkalan data) kekal Rumi; paparan dalam Jawi.
const LABEL = {
  'Al-Quran': 'القرءان', Hadis: 'حديث', Akidah: 'عقيدة', Fiqah: 'فقه', Sirah: 'سيرة', Akhlak: 'اخلاق',
  Rendah: 'رنده', Sederhana: 'سدرهان', Tinggi: 'تيڠݢي', KBAT: 'KBAT', Campuran: 'چمڤورن',
  Objektif: 'اوبجيکتيف', Subjektif: 'سوبجيکتيف',
};
const TAHUN_INI = new Date().getFullYear();
const HARI_INI = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, zon waktu tempatan

// Ingat tetapan terakhir guru (kemudahan sahaja — selamat jika localStorage tiada).
const pref = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(`janapai:${key}`)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`janapai:${key}`, JSON.stringify(value)); } catch { /* abaikan */ }
  },
};

Alpine.data('app', () => ({
  BIDANG, ARAS,
  lb: (k) => LABEL[k] ?? k,

  // --- Umum ------------------------------------------------------------------
  // ?tab=rpt (pintasan manifest) mengatasi tab terakhir yang diingati
  tab: [new URLSearchParams(location.search).get('tab'), pref.get('tab', null)].find((t) => TAB.includes(t)) ?? 'soalan',
  online: navigator.onLine,
  toast: null,
  cetakSkema: true,

  // --- Jana Soalan -----------------------------------------------------------
  sq: {
    tingkatan: pref.get('sq.tingkatan', 1),
    bidang: pref.get('sq.bidang', 'Akidah'),
    dskpList: [],
    dskp_id: '',
    aras: 'Campuran',
    jenis: 'Objektif',
    bilangan: 5,
    loading: false,
    menyimpan: false,
    hasil: null, // { konteks, soalan: [...] }
  },

  // --- Jana RPT --------------------------------------------------------------
  rp: {
    tahun: TAHUN_INI,
    kumpulan: pref.get('rp.kumpulan', KUMPULAN_TAKWIM_LALAI),
    tingkatan: pref.get('rp.tingkatan', 1),
    dari_minggu: 1,
    takwim: [],
    tajuk: [],     // DSKP tingkatan + { dipilih }
    rptSedia: [],  // RPT tersimpan
    loading: false,
    memuat: false,
    menyimpan: false,
    hasil: null,   // { minggu, tajuk_tertinggal, nota }
  },

  // --- Bank Soalan -----------------------------------------------------------
  bk: { tingkatan: '', bidang: '', aras: '', items: [], jumlah: 0, offset: 0, limit: 20, loading: false },

  // ===========================================================================
  init() {
    addEventListener('online', () => { this.online = true; });
    addEventListener('offline', () => { this.online = false; });
    this.$watch('tab', (t) => { pref.set('tab', t); this.muatTab(); });
    this.muatTab();
  },

  muatTab() {
    if (this.tab === 'soalan' && !this.sq.dskpList.length) this.muatDskpSoalan();
    if (this.tab === 'rpt' && !this.rp.tajuk.length) this.muatDataRpt();
    if (this.tab === 'bank') this.muatBank(0);
  },

  notify(mesej, jenis = 'ok') {
    this.toast = { mesej, jenis };
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this.toast = null; }, jenis === 'ralat' ? 7000 : 3500);
  },

  async cuba(fn) {
    try {
      return await fn();
    } catch (err) {
      this.notify(this.online ? err.message : 'تياد سمبوڠن اينترنيت. سيلا چوبا لاݢي اڤابيلا دالم تالين.', 'ralat');
      return undefined;
    }
  },

  // ===========================================================================
  // Jana Soalan
  // ===========================================================================
  async muatDskpSoalan() {
    const s = this.sq;
    pref.set('sq.tingkatan', s.tingkatan);
    pref.set('sq.bidang', s.bidang);
    s.dskpList = (await this.cuba(() => getDskp({ tingkatan: Number(s.tingkatan), bidang: s.bidang }))) ?? [];
    if (!s.dskpList.some((d) => d.id === s.dskp_id)) s.dskp_id = s.dskpList[0]?.id ?? '';
  },

  get dskpDipilih() {
    return this.sq.dskpList.find((d) => d.id === this.sq.dskp_id) ?? null;
  },

  async janaSoalan() {
    const s = this.sq;
    if (!s.dskp_id) return this.notify('ڤيليه تاجوق DSKP ترلبيه دهولو.', 'ralat');
    s.loading = true;
    try {
      const res = await this.cuba(() => janaSoalan({
        dskp_id: s.dskp_id, aras: s.aras, jenis: s.jenis, bilangan: Number(s.bilangan),
      }));
      if (res) {
        s.hasil = { konteks: res.konteks, soalan: res.soalan.map((q) => ({ ...q, _pilih: true, _edit: false })) };
        if (res.soalan.length < Number(s.bilangan)) {
          this.notify(`هاڽ ${res.soalan.length} سوالن صح دجان. اندا بوليه جان سمولا اونتوق تمبهن.`);
        }
      }
    } finally {
      s.loading = false;
    }
  },

  get bilSoalanDipilih() {
    return this.sq.hasil?.soalan.filter((q) => q._pilih).length ?? 0;
  },

  async simpanSoalanDipilih() {
    const { hasil } = this.sq;
    const dipilih = hasil.soalan.filter((q) => q._pilih);
    if (!dipilih.length) return this.notify('تياد سوالن دڤيليه.', 'ralat');
    this.sq.menyimpan = true;
    const ids = await this.cuba(() => simpanSoalan(dipilih.map((q) => toKoleksiRow(q, hasil.konteks))));
    this.sq.menyimpan = false;
    if (ids) {
      this.notify(`${ids.length} سوالن دسيمڤن ک بڠک سوالن.`);
      hasil.soalan = hasil.soalan.filter((q) => !q._pilih);
      if (!hasil.soalan.length) this.sq.hasil = null;
    }
  },

  // ===========================================================================
  // Jana RPT
  // ===========================================================================
  async muatDataRpt() {
    const r = this.rp;
    pref.set('rp.kumpulan', r.kumpulan);
    pref.set('rp.tingkatan', r.tingkatan);
    r.memuat = true;
    r.hasil = null;
    const data = await this.cuba(() => Promise.all([
      getTakwim({ tahun: Number(r.tahun), kumpulan: r.kumpulan }),
      getDskp({ tingkatan: Number(r.tingkatan) }),
      getRpt({ tahun: Number(r.tahun), tingkatan: Number(r.tingkatan) }),
    ]));
    r.memuat = false;
    if (!data) return;

    const [takwim, dskp, rptSedia] = data;
    r.takwim = takwim;
    r.rptSedia = rptSedia;

    // Tajuk yang sudah dijadualkan pada minggu yang telah berlalu dianggap "sudah diajar".
    const sudahDiajar = new Set(rptSedia.filter((x) => x.tajuk_id && x.tarikh_tamat < HARI_INI).map((x) => x.tajuk_id));
    r.tajuk = dskp.map((d) => ({ ...d, dipilih: !sudahDiajar.has(d.id), sudahDiajar: sudahDiajar.has(d.id) }));

    // Mula dari minggu semasa jika tahun ini; jika tidak, dari minggu 1.
    const semasa = takwim.find((m) => m.tarikh_tamat >= HARI_INI);
    r.dari_minggu = Number(r.tahun) === TAHUN_INI && semasa ? semasa.minggu_ke : takwim[0]?.minggu_ke ?? 1;
  },

  get bilTajukDipilih() {
    return this.rp.tajuk.filter((t) => t.dipilih).length;
  },

  pilihSemuaTajuk(nilai) {
    this.rp.tajuk.forEach((t) => { t.dipilih = nilai; });
  },

  tajukById(id) {
    return this.rp.tajuk.find((t) => t.id === id) ?? null;
  },

  async janaRpt() {
    const r = this.rp;
    if (!r.takwim.length) return this.notify(`تقويم ${r.tahun} کومڤولن ${r.kumpulan} بلوم اد دالم ڤڠکالن داتا.`, 'ralat');
    const dskp_ids = r.tajuk.filter((t) => t.dipilih).map((t) => t.id);
    if (!dskp_ids.length) return this.notify('ڤيليه سکورڠ-کورڠڽ ساتو تاجوق.', 'ralat');

    r.loading = true;
    try {
      const res = await this.cuba(() => janaRpt({
        tahun: Number(r.tahun), kumpulan: r.kumpulan, tingkatan: Number(r.tingkatan),
        dari_minggu: Number(r.dari_minggu), dskp_ids,
      }));
      if (res) r.hasil = res;
    } finally {
      r.loading = false;
    }
  },

  async simpanRptHasil() {
    const r = this.rp;
    const bilLama = r.rptSedia.filter((x) => x.minggu_ke >= Number(r.dari_minggu)).length;
    if (bilLama && !confirm(`RPT سديا اد دري ميڠݢو ${r.dari_minggu} (${bilLama} باريس) اکن دݢنتيکن. تروسکن؟`)) return;

    r.menyimpan = true;
    const bil = await this.cuba(() => simpanRpt({
      tahun: Number(r.tahun), tingkatan: Number(r.tingkatan), dariMinggu: Number(r.dari_minggu), minggu: r.hasil.minggu,
    }));
    r.menyimpan = false;
    if (bil !== undefined) {
      this.notify(`RPT دسيمڤن (${bil} باريس).`);
      r.rptSedia = (await this.cuba(() => getRpt({ tahun: Number(r.tahun), tingkatan: Number(r.tingkatan) }))) ?? [];
    }
  },

  // ===========================================================================
  // Bank Soalan
  // ===========================================================================
  async muatBank(offset = this.bk.offset) {
    const b = this.bk;
    b.loading = true;
    const res = await this.cuba(() => getKoleksiSoalan({
      tingkatan: b.tingkatan ? Number(b.tingkatan) : null,
      bidang: b.bidang || null,
      aras: b.aras || null,
      limit: b.limit,
      offset,
    }));
    b.loading = false;
    if (res) Object.assign(b, { items: res.items, jumlah: res.jumlah, offset });
  },

  async padam(id) {
    if (!confirm('ڤادم سوالن اين درڤد بڠک؟')) return;
    const ok = await this.cuba(() => padamSoalan(id).then(() => true));
    if (ok) {
      this.notify('سوالن دڤادم.');
      this.muatBank(this.bk.items.length === 1 && this.bk.offset ? this.bk.offset - this.bk.limit : this.bk.offset);
    }
  },

  async salin(q) {
    const pilihan = q.pilihan_jawapan
      ? '\n' + ['A', 'B', 'C', 'D'].map((k) => `${k}. ${q.pilihan_jawapan[k]}`).join('\n')
      : '';
    const teks = `${q.soalan}${pilihan}\n\nسکيما:\n${q.skema_jawapan}`;
    const ok = await navigator.clipboard?.writeText(teks).then(() => true, () => false);
    this.notify(ok ? 'سوالن دسالين.' : 'تيدق داڤت مڽالين ڤد ڤلاير اين.', ok ? 'ok' : 'ralat');
  },

  cetak(denganSkema) {
    this.cetakSkema = denganSkema;
    this.$nextTick(() => print());
  },

  // ===========================================================================
  // Format
  // ===========================================================================
  tarikh(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  },

  warnaAras(aras) {
    return {
      Rendah: 'bg-sky-100 text-sky-800',
      Sederhana: 'bg-amber-100 text-amber-800',
      Tinggi: 'bg-orange-100 text-orange-800',
      KBAT: 'bg-fuchsia-100 text-fuchsia-800',
    }[aras] ?? 'bg-slate-100 text-slate-700';
  },
}));

Alpine.start();

// Daftar Service Worker (PWA)
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
}
