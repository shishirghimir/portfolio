// Next.js 16 static export writes route-segment prefetch payloads as nested
// folders (out/x/__next.services/$d$slug/__PAGE__.txt) while the client router
// requests them dot-joined (out/x/__next.services.$d$slug.__PAGE__.txt).
// Static hosts can't map one to the other, so every prefetch 404s and client
// navigation falls back to full page loads. Write the flat copies too.
import fs from "node:fs/promises";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
let count = 0;

async function flatten(dir, prefix, target) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await flatten(p, `${prefix}.${e.name}`, target);
    else if (e.name.endsWith(".txt")) {
      await fs.copyFile(p, path.join(target, `${prefix}.${e.name}`));
      count++;
    }
  }
}

async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith("__next.")) await flatten(p, e.name, dir);
    else if (e.name !== "_next") await walk(p);
  }
}

await walk(out);
console.log(`postbuild: wrote ${count} flattened prefetch payloads`);
