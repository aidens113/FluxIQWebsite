// Generates every served brand image from the masters in design/brand/. The
// masters are never served; these derivatives are committed. Running it again
// rewrites the same bytes, so it is safe to rerun at any time.
//
// Masters:
//   design/brand/fluxiq-mark.svg         the app icon: the F-and-node mark on an ink tile
//   design/brand/og-banner-master.png    2400 x 1260, rendered from og-banner.html
//
// Outputs:
//   src/app/icon.png                  512 x 512, the mark
//   src/app/apple-icon.png            180 x 180, the mark
//   src/app/favicon.ico               an ICO container holding one 32 x 32 PNG
//   src/app/opengraph-image.png       1200 x 630, the banner
//   src/app/opengraph-image.alt.txt   the Open Graph image's alt text
//
// Usage:  pnpm brand:assets
//   Prints one line per output with its size, and exits 1 if any output is
//   over the 300 KB asset budget.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_MASTER = path.join(ROOT, "design/brand/fluxiq-mark.svg");
const BANNER_MASTER = path.join(ROOT, "design/brand/og-banner-master.png");
const MAX_BYTES = 300 * 1024;
const MASTER_SIZE = 512;

const OG_SIZE = { width: 1200, height: 630 };
const OG_ALT = "The FluxIQ mark and wordmark above the headline: Only pay AI for what FluxIQ doesn’t already know.";

const PNG_OPTIONS = { compressionLevel: 9, effort: 10, palette: true, quality: 95 };

// The SVG is rasterised at the density that yields the target size directly,
// so small icons are drawn sharp rather than scaled down from a large bitmap.
function logo(size) {
  return sharp(LOGO_MASTER, { density: (72 * size) / MASTER_SIZE }).resize(size, size, { kernel: "lanczos3" });
}

// An ICO file is a 6-byte header, one 16-byte directory entry per image, then
// the image data. Since Windows Vista the data may be a whole PNG file.
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size % 256, 0); // width; 0 means 256
  entry.writeUInt8(size % 256, 1); // height
  entry.writeUInt8(0, 2); // palette size: none
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image data size
  entry.writeUInt32LE(header.length + entry.length, 12); // image data offset
  return Buffer.concat([header, entry, png]);
}

async function openGraphImage() {
  return sharp(BANNER_MASTER)
    .resize(OG_SIZE.width, OG_SIZE.height, { fit: "fill", kernel: "lanczos3" })
    .png(PNG_OPTIONS)
    .toBuffer();
}

async function build() {
  // Next's ICO decoder accepts only RGBA PNG images, so force the alpha channel.
  const favicon = await logo(32).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();
  return [
    ["src/app/icon.png", await logo(512).png(PNG_OPTIONS).toBuffer()],
    ["src/app/apple-icon.png", await logo(180).png(PNG_OPTIONS).toBuffer()],
    ["src/app/favicon.ico", icoFromPng(favicon, 32)],
    ["src/app/opengraph-image.png", await openGraphImage()],
    // No trailing newline: Next reads this file verbatim into og:image:alt.
    ["src/app/opengraph-image.alt.txt", Buffer.from(OG_ALT, "utf8")],
  ];
}

async function main() {
  let overBudget = 0;
  for (const [relativePath, bytes] of await build()) {
    const target = path.join(ROOT, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
    const over = bytes.length > MAX_BYTES;
    if (over) overBudget++;
    const kilobytes = (bytes.length / 1024).toFixed(1);
    console.log(`${over ? "OVER " : ""}${relativePath}: ${kilobytes} KB`);
  }
  if (overBudget > 0) {
    console.log(`brand-assets: ${overBudget} output(s) over ${MAX_BYTES / 1024} KB`);
    return 1;
  }
  return 0;
}

process.exitCode = await main();
