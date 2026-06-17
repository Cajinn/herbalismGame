// Generates the app icons (no external deps — minimal PNG encoder + zlib).
// Draws a stylised herb leaf in the game's palette on a dark background.
// Run: node tools/make_icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../assets/icons/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// ── CRC32 (PNG chunk checksums) ────────────────────────────────────────────
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function encodePNG(size, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  // 10,11,12 = compression/filter/interlace = 0
  const stride = size * 3;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Drawing ─────────────────────────────────────────────────────────────────
const BG = [42, 31, 18]; // --color-bg #2a1f12
const LEAF = [124, 179, 66]; // --green-accent #7cb342
const LEAF_HI = [164, 204, 107]; // --green-light #a4cc6b
const VEIN = [74, 124, 42]; // success green
const STEM = [122, 82, 48]; // wood-deep

function draw(size) {
  const rgb = Buffer.alloc(size * size * 3);
  const set = (x, y, c) => {
    const i = (y * size + x) * 3;
    rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Normalised coords centred at origin, then rotate -45° so the leaf
      // (a vesica formed by two offset circles) stands on a diagonal.
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.5) * 2;
      const a = Math.PI / 4;
      const rx = nx * Math.cos(a) - ny * Math.sin(a);
      const ry = nx * Math.sin(a) + ny * Math.cos(a);

      const R = 0.95;
      const d = 0.5; // circle offset → leaf width
      const in1 = (rx - d) ** 2 + ry ** 2 <= R * R;
      const in2 = (rx + d) ** 2 + ry ** 2 <= R * R;

      let c = BG;
      if (in1 && in2) {
        c = LEAF;
        // central vein along the long axis (rx), plus a few side veins
        const vein = Math.abs(ry) < 0.05;
        const side = Math.abs(Math.abs(ry) - Math.abs(rx) * 0.55) < 0.045 && Math.abs(rx) < 0.6;
        if (vein || side) c = VEIN;
        else if (ry < -0.04) c = LEAF_HI; // upper half catches light
      }
      // little stem at the bottom-right tip
      const sx = rx + 0.92, sy = ry + 0.0;
      if (sx > 0 && sx < 0.28 && Math.abs(sy - sx * 0.9) < 0.06) c = STEM;

      set(x, y, c);
    }
  }
  return rgb;
}

for (const size of [180, 192, 512]) {
  const png = encodePNG(size, draw(size));
  writeFileSync(new URL(`icon-${size}.png`, OUT), png);
  console.log(`wrote icon-${size}.png (${png.length} bytes)`);
}
