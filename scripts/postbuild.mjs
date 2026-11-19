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
