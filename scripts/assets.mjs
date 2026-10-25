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

// ---- icons: the white Netanix mark on a dark rounded tile -------------------
const mark = await sharp(P("brand", "mark-light.png")).trim().png().toBuffer();
async function tile(size, pad, radius, bg = "#07090c") {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mark).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const r = Math.round(size * radius);
  const svg = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/></svg>`);
  return sharp(svg).composite([{ input: m, gravity: "center" }]).png().toBuffer();
}
for (const s of [16, 32, 48]) await fs.writeFile(P(`icon-${s}.png`), await tile(s, 0.08, 0.2));
for (const s of [192, 512]) await fs.writeFile(P(`icon-${s}.png`), await tile(s, 0.14, 0.22));
await fs.writeFile(P("apple-touch-icon.png"), await tile(180, 0.14, 0.22));
await fs.writeFile(P("icon-maskable-512.png"), await tile(512, 0.22, 0));
await fs.writeFile(P("favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${(await tile(96, 0.1, 0.2)).toString("base64")}"/></svg>`);
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

console.log("assets written to public/");
