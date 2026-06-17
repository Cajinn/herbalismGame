// Generates owned, redistributable replacement tiles (no external deps —
// minimal PNG encoder + zlib). Tileable 16×16, in the game's warm palette.
// Run: node tools/make_tiles.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../assets/tiles/owned/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
};
function encodePNG(size, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit truecolour RGB
  const stride = size * 3;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const S = 16;
// Deterministic per-pixel jitter (no Math.random — keeps output reproducible).
const hash = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

// Tilled soil: warm brown earth with horizontal furrows (wraps at 16px).
function tilledSoil() {
  const base = [0x6b, 0x4a, 0x2e];
  const ridge = [0x7e, 0x59, 0x38];
  const furrow = [0x55, 0x3a, 0x23];
  const speck = [0x4a, 0x32, 0x1e];
  const rgb = Buffer.alloc(S * S * 3);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let c = base;
      const m = y % 4;
      if (m === 0) c = furrow;           // furrow trough
      else if (m === 1) c = ridge;       // lit ridge just below
      if (hash(x, y) > 0.86) c = speck;  // scattered grains
      const i = (y * S + x) * 3;
      rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
    }
  }
  return rgb;
}

writeFileSync(new URL("tilled_soil.png", OUT), encodePNG(S, tilledSoil()));
console.log("wrote assets/tiles/owned/tilled_soil.png");
