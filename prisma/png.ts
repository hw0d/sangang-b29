import { deflateSync } from "node:zlib";

// Minimal, dependency-free PNG encoder used only to generate seed-data
// placeholder images (so seed avatars are real PNGs, same as what an
// admin-uploaded mugshot photo would be, rather than SVG).

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function encodeRgbPng(
  size: number,
  paint: (x: number, y: number) => [number, number, number]
): Buffer {
  const rows: Buffer[] = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = paint(x, y);
      const idx = 1 + x * 3;
      row[idx] = r;
      row[idx + 1] = g;
      row[idx + 2] = b;
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Simple head-and-shoulders silhouette placeholder, tinted by hue.
export function makeAvatarPng(hue: number, size = 200): Buffer {
  const bg = hslToRgb(hue, 30, 16);
  const fg = hslToRgb(hue, 22, 34);

  const headCx = size / 2;
  const headCy = size * 0.38;
  const headR = size * 0.18;
  const bodyTop = size * 0.62;

  return encodeRgbPng(size, (x, y) => {
    const dx = x - headCx;
    const dy = y - headCy;
    const isHead = dx * dx + dy * dy <= headR * headR;
    const isBody =
      y >= bodyTop &&
      Math.abs(x - size / 2) <=
        size * 0.42 * ((y - bodyTop) / (size - bodyTop) + 0.3);
    return isHead || isBody ? fg : bg;
  });
}

// Simple ring placeholder for tattoo/marking photos, tinted by hue.
export function makeMarkingPng(hue: number, size = 200): Buffer {
  const bg = hslToRgb(hue, 20, 12);
  const fg = hslToRgb(hue, 60, 45);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.24;
  const thickness = size * 0.035;

  return encodeRgbPng(size, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(dist - r) <= thickness ? fg : bg;
  });
}
