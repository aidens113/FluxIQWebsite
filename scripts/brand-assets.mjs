// Generates every served brand image from the full-resolution masters in
// design/brand/. The masters are never served; these derivatives are committed.
// Running it again rewrites the same bytes, so it is safe to rerun at any time.
//
// Outputs:
//   src/app/icon.png                  512 x 512, the logo
//   src/app/apple-icon.png            180 x 180, the logo
//   src/app/favicon.ico               an ICO container holding one 32 x 32 PNG
//   src/app/opengraph-image.png       1200 x 630, cropped from the banner
//   src/app/opengraph-image.alt.txt   the Open Graph image's alt text
//   public/brand/fluxiq-logo.webp     288 x 288 (144 px at 2x), black keyed to transparent
//
// Usage:  pnpm brand:assets
//   Prints one line per output with its size, and exits 1 if any output is
//   over the 300 KB asset budget.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_MASTER = path.join(ROOT, "design/brand/fluxiq-logo-master.png");
const BANNER_MASTER = path.join(ROOT, "design/brand/og-banner-master.png");
const MAX_BYTES = 300 * 1024;

// The Open Graph crop, as fractions of the banner master so it holds at any
// master size (measured on both the 1600 x 595 and 2056 x 765 masters). The
// logo and wordmark group spans x 0.318 to 0.698 and y 0.307 to 0.590; the
// window is centred on it. The corner labels end at x 0.20 ("Ideas -> Action")
// and start at x 0.85 ("Adapt / Automate / Evolve"). A plain cover crop at
// 630 px high is 0.71 of the width and slices "ACTION" to "CTION" at the left
// edge, so the window is 0.58 of the width, which leaves both labels wholly out.
const OG_SIZE = { width: 1200, height: 630 };
const OG_GROUP_CENTRE = { x: 0.508, y: 0.449 };
const OG_WINDOW_WIDTH = 0.58;
const OG_ALT = "The FluxIQ logo and wordmark with the tagline Automate Smarter, between blue and purple light waves.";

const PNG_OPTIONS = { compressionLevel: 9, effort: 10, palette: true, quality: 95 };

function logo(size) {
  return sharp(LOGO_MASTER).resize(size, size, { kernel: "lanczos3" });
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

// The logo master is opaque on black. Keying black to transparency (alpha is
// the brightest channel, colour is divided back out) lets the page's own
// background show through, so the logo sits on #03001c without a black square.
async function logoOnTransparent(size) {
  const { data, info } = await logo(size).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    const r = data[pixel * 3] ?? 0;
    const g = data[pixel * 3 + 1] ?? 0;
    const b = data[pixel * 3 + 2] ?? 0;
    const alpha = Math.max(r, g, b);
    const scale = alpha === 0 ? 0 : 255 / alpha;
    rgba[pixel * 4] = Math.round(r * scale);
    rgba[pixel * 4 + 1] = Math.round(g * scale);
    rgba[pixel * 4 + 2] = Math.round(b * scale);
    rgba[pixel * 4 + 3] = alpha;
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 90, effort: 6 })
    .toBuffer();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Crops the banner to the 1200:630 window centred on the logo and wordmark,
// then scales that window to exactly 1200 x 630.
async function openGraphImage() {
  const { width = 0, height = 0 } = await sharp(BANNER_MASTER).metadata();
  const aspect = OG_SIZE.width / OG_SIZE.height;
  let cropWidth = Math.round(width * OG_WINDOW_WIDTH);
  let cropHeight = Math.round(cropWidth / aspect);
  if (cropHeight > height) {
    cropHeight = height;
    cropWidth = Math.round(height * aspect);
  }
  const crop = {
    left: clamp(Math.round(width * OG_GROUP_CENTRE.x - cropWidth / 2), 0, width - cropWidth),
    top: clamp(Math.round(height * OG_GROUP_CENTRE.y - cropHeight / 2), 0, height - cropHeight),
    width: cropWidth,
    height: cropHeight,
  };
  return sharp(BANNER_MASTER)
    .extract(crop)
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
    ["public/brand/fluxiq-logo.webp", await logoOnTransparent(288)],
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
