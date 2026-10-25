// Turns the source photos and screenshots in /assets into web-ready files in
// /public: AVIF + WebP at the sizes the site uses, plus all icons.
// Run with `npm run assets` whenever a source image changes.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const A = (...p) => path.join(root, "assets", ...p);
const P = (...p) => path.join(root, "public", ...p);
await Promise.all(["photos", "work", "brand"].map((d) => fs.mkdir(P(d), { recursive: true })));

// ---- portraits: [source, name, crop gravity] ------------------------------
const photos = [
  ["dusk.png", "dusk", "north"],
  ["cyber.jpg", "cyber", "north"],
  ["nagarkot.jpg", "nagarkot", "centre"],
  ["kurintar.png", "kurintar", "centre"],
];
for (const [src, name, gravity] of photos) {
  const img = sharp(A("photos", src)).rotate();
  for (const [suffix, w] of [["", 1200], ["-sm", 640]]) {
    const base = img.clone().resize({ width: w, withoutEnlargement: true, position: gravity });
    await base.clone().webp({ quality: 80, smartSubsample: true }).toFile(P("photos", `${name}${suffix}.webp`));
    await base.clone().avif({ quality: 52 }).toFile(P("photos", `${name}${suffix}.avif`));
  }
}

// ---- MemVault screenshots ---------------------------------------------------
for (const [src, name] of [["auto_analyze_tab.png", "memvault-analyze"], ["dump_tab.png", "memvault-dump"], ["banner.png", "memvault-banner"]]) {
  await sharp(A("memvault", src)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(P("work", `${name}.webp`));
}

// ---- icons: Shishir's SG mark on a dark rounded tile -------------------------
const markSvg = await fs.readFile(A("brand", "mark.svg"));
const mark = await sharp(markSvg, { density: 600 }).resize(512, 512).png().toBuffer();
await fs.writeFile(P("brand", "sg-mark.png"), mark);
async function tile(size, pad, radius, bg = "#07090c") {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mark).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const r = Math.round(size * radius);
  const svg = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/></svg>`);
  return sharp(svg).composite([{ input: m, gravity: "center" }]).png().toBuffer();
}
// tab sizes use a bolder, simpler mark so the letters stay readable at 16 px
const small = await fs.readFile(A("brand", "mark-small.svg"));
const smallPng = (size) => sharp(small, { density: 1200 }).resize(size, size).png().toBuffer();
for (const s of [16, 32, 48]) await fs.writeFile(P(`icon-${s}.png`), await smallPng(s));
for (const s of [192, 512]) await fs.writeFile(P(`icon-${s}.png`), await tile(s, 0.14, 0.22));
await fs.writeFile(P("apple-touch-icon.png"), await tile(180, 0.14, 0.22));
await fs.writeFile(P("icon-maskable-512.png"), await tile(512, 0.22, 0));
await fs.writeFile(P("favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${(await smallPng(96)).toString("base64")}"/></svg>`);
// favicon.ico with 16/32/48 PNG frames
const frames = await Promise.all([16, 32, 48].map((s) => fs.readFile(P(`icon-${s}.png`))));
const head = Buffer.alloc(6 + frames.length * 16);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(frames.length, 4);
let offset = head.length;
frames.forEach((buf, i) => {
  const s = [16, 32, 48][i], o = 6 + i * 16;
  head.writeUInt8(s, o); head.writeUInt8(s, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
  head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(buf.length, o + 8); head.writeUInt32LE(offset, o + 12);
  offset += buf.length;
});
await fs.writeFile(P("favicon.ico"), Buffer.concat([head, ...frames]));
// a square logo for search engines (Person / Organization image)
await fs.writeFile(P("brand", "logo-square.png"), await tile(600, 0.16, 0.12));

// ---- partner and event logos -------------------------------------------------
// white silhouettes for logos that are black or dark blue, so they read on the dark theme
async function whiteLogo(src, out) {
  const { data, info } = await sharp(A("logos-src", src)).ensureAlpha().resize({ width: 720, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    // keep the shape (alpha and darkness), paint it white
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const a = data[i + 3] * (lum > 235 ? 0 : 1);
    data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = a;
  }
  await sharp(data, { raw: info }).trim().webp({ quality: 90 }).toFile(P("logos", out));
}
await whiteLogo("blackhat.png", "blackhat-white.webp");
await whiteLogo("coventry.png", "coventry-white.webp");
// Softwarica: the official logo carries a Coventry co-brand on the right, keep only Softwarica
await sharp(A("logos-src", "softwarica.png")).extract({ left: 0, top: 50, width: 535, height: 142 }).trim().png().toFile(A("logos-src", "softwarica-only.png"));
await whiteLogo("softwarica-only.png", "softwarica-white.webp");
for (const [src, out] of [["tryhackme.com.png", "tryhackme.webp"], ["ctftime.org.png", "ctftime.webp"]]) {
  await sharp(A("logos-src", src)).webp({ quality: 90 }).toFile(P("logos", out));
}

console.log("assets written to public/");
