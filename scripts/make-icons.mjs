#!/usr/bin/env node
// Jana ikon PWA (bulan sabit di atas buku terbuka, latar hijau) tanpa sebarang kebergantungan.
// Output: web/icons/{icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png}
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const OUT = new URL('../web/icons/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const BG = [4, 120, 87];      // emerald-700
const FG = [255, 255, 255];

// Bentuk dalam koordinat unit (0..1)
const BULAN = { luar: { x: 0.5, y: 0.35, r: 0.17 }, dalam: { x: 0.57, y: 0.31, r: 0.145 } };
// Buku terbuka: dua halaman condong dengan celah di tengah
const HALAMAN_KIRI = [[0.18, 0.58], [0.485, 0.64], [0.485, 0.84], [0.18, 0.78]];
const HALAMAN_KANAN = HALAMAN_KIRI.map(([x, y]) => [1 - x, y]);

const dalamBulatan = (x, y, c) => (x - c.x) ** 2 + (y - c.y) ** 2 <= c.r ** 2;
function dalamPoligon(x, y, pts) {
  let masuk = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) masuk = !masuk;
  }
  return masuk;
}
const latarDepan = (x, y) =>
  (dalamBulatan(x, y, BULAN.luar) && !dalamBulatan(x, y, BULAN.dalam)) ||
  dalamPoligon(x, y, HALAMAN_KIRI) || dalamPoligon(x, y, HALAMAN_KANAN);

function dalamSegiBulat(x, y, radius) {
  const cx = Math.min(Math.max(x, radius), 1 - radius);
  const cy = Math.min(Math.max(y, radius), 1 - radius);
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

/** @param {number} size @param {{ maskable?: boolean }} opts */
function lukis(size, { maskable = false } = {}) {
  const SS = 4; // supersampling untuk tepi licin
  const skala = maskable ? 0.8 : 1; // zon selamat ikon maskable
  const px = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let pxX = 0; pxX < size; pxX++) {
      let bg = 0, fg = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (pxX + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          if (!maskable && !dalamSegiBulat(x, y, 0.2)) continue;
          bg++;
          const ux = (x - 0.5) / skala + 0.5, uy = (y - 0.5) / skala + 0.5;
          if (latarDepan(ux, uy)) fg++;
        }
      }
      const n = SS * SS, t = bg ? fg / bg : 0, i = (py * size + pxX) * 4;
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(BG[c] * (1 - t) + FG[c] * t);
      px[i + 3] = Math.round((bg / n) * 255);
    }
  }
  return png(size, size, px);
}

// --- Pengekod PNG minimum (RGBA 8-bit) ----------------------------------------
const CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- SVG (bentuk yang sama) ---------------------------------------------------
const u = (v) => +(v * 512).toFixed(1);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><mask id="sabit"><rect width="512" height="512" fill="#fff"/><circle cx="${u(BULAN.dalam.x)}" cy="${u(BULAN.dalam.y)}" r="${u(BULAN.dalam.r)}" fill="#000"/></mask></defs>
  <rect width="512" height="512" rx="${u(0.2)}" fill="rgb(${BG})"/>
  <circle cx="${u(BULAN.luar.x)}" cy="${u(BULAN.luar.y)}" r="${u(BULAN.luar.r)}" fill="#fff" mask="url(#sabit)"/>
  ${[HALAMAN_KIRI, HALAMAN_KANAN].map((h) => `<polygon points="${h.map(([x, y]) => `${u(x)},${u(y)}`).join(' ')}" fill="#fff"/>`).join('\n  ')}
</svg>
`;

writeFileSync(new URL('icon.svg', OUT), svg);
writeFileSync(new URL('icon-192.png', OUT), lukis(192));
writeFileSync(new URL('icon-512.png', OUT), lukis(512));
writeFileSync(new URL('icon-maskable-512.png', OUT), lukis(512, { maskable: true }));
writeFileSync(new URL('apple-touch-icon.png', OUT), lukis(180, { maskable: true })); // iOS: tanpa lutsinar
console.log('Ikon dijana di web/icons/');
