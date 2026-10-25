// Open Graph cards (1200×630) for every page and project, so shared links on
// LinkedIn, WhatsApp, Facebook and X show a proper preview.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const P = (...p) => path.join(root, "public", ...p);
await fs.mkdir(P("og"), { recursive: true });
const W = 1200, H = 630;
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, max) {
  const lines = [""];
  for (const w of text.split(" ")) {
    if ((lines.at(-1) + " " + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (lines.at(-1) + " " + w).trim();
  }
  return lines;
}

const mark = await sharp(P("brand", "sg-mark.png")).trim().resize({ height: 52 }).png().toBuffer();
const markW = (await sharp(mark).metadata()).width;

async function rounded(input, w, h, r, fit = "cover", position = "north") {
  const img = await sharp(input).resize(w, h, { fit, position, background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);
  return sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function card({ out, kicker, title, sub, visual, accent = "#8be04e" }) {
  const lines = wrap(title, visual?.kind === "photo" ? 18 : 20).slice(0, 3);
  const size = lines.length > 2 ? 56 : 66;
  const tY = 250;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="a" cx="0.9" cy="0" r="0.9"><stop offset="0" stop-color="${accent}" stop-opacity="0.32"/><stop offset="1" stop-color="#050608" stop-opacity="0"/></radialGradient>
      <radialGradient id="b" cx="0" cy="1" r="0.7"><stop offset="0" stop-color="#38d6ff" stop-opacity="0.14"/><stop offset="1" stop-color="#050608" stop-opacity="0"/></radialGradient>
      <pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#fff" stroke-opacity="0.045"/></pattern>
    </defs>
    <rect width="100%" height="100%" fill="#050608"/><rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)"/>
    <text x="${70 + markW + 16}" y="96" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#eef2f6">Shishir Ghimire</text>
    <text x="${70 + markW + 16}" y="122" font-family="Consolas, monospace" font-size="15" letter-spacing="3" fill="#6b7584">AKA NETA</text>
    <text x="70" y="200" font-family="Consolas, monospace" font-size="18" letter-spacing="3" fill="${accent}">&gt; ${esc(kicker.toUpperCase())}</text>
    ${lines.map((l, i) => `<text x="70" y="${tY + i * (size + 6) + size * 0.5}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="800" fill="#eef2f6">${esc(l)}</text>`).join("")}
    <text x="70" y="${tY + lines.length * (size + 6) + 42}" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#9aa4b2">${esc(sub)}</text>
    <rect x="70" y="548" width="64" height="4" rx="2" fill="${accent}"/>
    <text x="70" y="590" font-family="Consolas, monospace" font-size="19" fill="#6b7584">shishirghimire.info.np</text>
  </svg>`;
  const layers = [{ input: mark, left: 70, top: 72 }];
  if (visual?.kind === "photo") {
    layers.push({ input: await rounded(visual.src, 380, 500, 26), left: 760, top: 65 });
    const br = Buffer.from(`<svg width="404" height="524"><path d="M2 30V2H30M374 2H402V30M402 494V522H374M30 522H2V494" fill="none" stroke="${accent}" stroke-width="4"/></svg>`);
    layers.push({ input: br, left: 748, top: 53 });
  }
  if (visual?.kind === "shot") layers.push({ input: await rounded(visual.src, 520, 390, 18), left: 640, top: 120 });
  if (visual?.kind === "logo") {
    layers.push({ input: Buffer.from(`<svg width="300" height="300"><rect width="300" height="300" rx="56" fill="#fff"/></svg>`), left: 800, top: 165 });
    layers.push({ input: await sharp(visual.src).resize(230, 230, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer(), left: 835, top: 200 });
  }
  if (visual?.kind === "terminal") {
    const t = Buffer.from(`<svg width="500" height="320" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="320" rx="20" fill="#04070a" stroke="${accent}" stroke-opacity="0.45"/>
      <circle cx="28" cy="26" r="6" fill="#ff5f57"/><circle cx="48" cy="26" r="6" fill="#febc2e"/><circle cx="68" cy="26" r="6" fill="#28c840"/>
      ${visual.lines.map((l, i) => `<text x="28" y="${82 + i * 42}" font-family="Consolas, monospace" font-size="17" fill="${i === 0 ? "#eef2f6" : l.includes("✓") ? "#8be04e" : "#9aa4b2"}">${esc(l.slice(0, 44))}</text>`).join("")}
    </svg>`);
    layers.push({ input: t, left: 650, top: 155 });
  }
  await sharp(Buffer.from(svg)).composite(layers).png({ compressionLevel: 9 }).toFile(out);
}

const photo = { kind: "photo", src: P("photos", "dusk.webp") };
const pages = [
  ["default", "Shishir Ghimire", "Cybersecurity student and CTF player", "Black Hat MEA 2026 finalist · Kathmandu, Nepal", photo],
  ["achievements", "Achievements", "Black Hat MEA 2026 finalist", "HackAstra #5 · TryHackMe top 1% · NetanixCTF", photo],
  ["about", "About me", "Late start. No days off.", "Student · CTF player · founder", { kind: "photo", src: P("photos", "cyber.webp") }],
  ["work", "Projects", "Built, led and secured", "Platforms, client systems and security tools", photo],
  ["writeups", "Research", "Writeups from the lab", "HackTheBox and TryHackMe walkthroughs", photo],
  ["certifications", "Credentials", "13 security certifications", "TryHackMe · Red Team Leaders · ICM Security", photo],
  ["now", "Now", "What I am working on right now", "NLab Billing · Black Hat MEA finals · NetanixCTF", photo],
  ["contact", "Contact", "Open a secure channel", "ssishir39@gmail.com", photo],
];
for (const [slug, kicker, title, sub, visual] of pages) await card({ out: P("og", `${slug}.png`), kicker, title, sub, visual });

// projects: read the fields we need straight from the content file
const src = await fs.readFile(path.join(root, "src/content/projects.ts"), "utf8");
const blocks = src.replace(/\r\n/g, "\n").split(/\n  \{\n/).slice(1).map((b) => `\n${b}`);
let n = 0;
for (const b of blocks) {
  const get = (k) => b.match(new RegExp(`\\n    ${k}: "([^"]+)"`))?.[1];
  const slug = get("slug");
  if (!slug) continue;
  const desktop = b.match(/desktop: "([^"]+)"/)?.[1];
  const logo = get("logo");
  const term = b.match(/terminal: \[([\s\S]*?")\],/)?.[1]?.match(/"([^"]+)"/g)?.map((s) => s.slice(1, -1));
  const visual = desktop ? { kind: "shot", src: P(desktop.slice(1)) } : term ? { kind: "terminal", lines: term } : logo ? { kind: "logo", src: P(logo.slice(1)) } : photo;
  await card({ out: P("og", `work-${slug}.png`), kicker: get("role")?.split(" · ")[0] ?? "Project", title: get("name"), sub: (get("year") ? `${get("year")} · ` : "") + (get("status") ?? ""), visual, accent: get("accent") });
  n++;
}
console.log(`og cards: ${pages.length} pages, ${n} projects`);
