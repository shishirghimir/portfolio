"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { X } from "lucide-react";
import { certs, person, skills, socials, wins } from "@/content/profile";
import { projects } from "@/content/projects";
import { useUI } from "@/store/ui";

type Line = { kind: "in" | "out" | "ok" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "ok", text: "netanix-os 2.0 · secure shell to shishirghimire.info.np" },
  { kind: "out", text: "Type 'help' to see what you can run. Esc closes." },
];

/** A small interactive shell for exploring the portfolio from the keyboard. */
export function Terminal() {
  const router = useRouter();
  const { closeAll } = useUI();
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [lines]);

  const print = (...l: Line[]) => setLines((x) => [...x, ...l]);
  const out = (text: string) => ({ kind: "out" as const, text });

  const run = (raw: string) => {
    const cmd = raw.trim();
    print({ kind: "in", text: cmd });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 30));
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    switch (name.toLowerCase()) {
      case "help":
        return print(...["whoami        who runs this site", "projects      list my work", "open <name>   open a project or page", "wins          competitions and milestones", "skills        what I work with", "certs         certifications", "socials       where to find me", "contact       how to reach me", "clear         clear the screen", "exit          close the terminal"].map(out));
      case "whoami":
        return print({ kind: "ok", text: `${person.name} (${person.alias})` }, out(person.role), out(person.short));
      case "ls":
      case "projects":
        return print(...projects.map((p) => out(`${p.slug.padEnd(20)} ${p.name} · ${p.role.split(" · ")[0]}`)), out("open <slug> to read more"));
      case "wins":
        return print(...wins.map((w) => out(`[+] ${w.title}: ${w.result}`)));
      case "skills":
        return print(...skills.map((s) => out(`${s.group.padEnd(20)} ${s.items.join(", ")}`)));
      case "certs":
        return print(...certs.flatMap((c) => [{ kind: "ok" as const, text: c.issuer }, ...c.items.map((i) => out(`  - ${i}`))]));
      case "socials":
        return print(...socials.map((s) => out(`${s.label.padEnd(12)} ${s.href}`)));
      case "contact":
        return print(out(`email     ${person.email}`), out("page      /contact/"), out("Or run: open contact"));
      case "open": {
        const p = projects.find((x) => x.slug === arg || x.name.toLowerCase() === arg);
        const page = ["work", "about", "writeups", "certifications", "now", "contact"].find((x) => x === arg);
        const href = p ? `/work/${p.slug}/` : page ? `/${page}/` : arg === "home" ? "/" : null;
        if (!href) return print({ kind: "err", text: `open: '${arg}' not found. Try 'projects'.` });
        print({ kind: "ok", text: `opening ${href}` });
        closeAll();
        return router.push(href);
      }
      case "sudo":
        return print({ kind: "ok", text: "Access granted. The fastest way to hire me is still email:" }, out(person.email));
      case "clear":
        return setLines([]);
      case "exit":
        return closeAll();
      default:
        return print({ kind: "err", text: `${name}: command not found. Type 'help'.` });
    }
  };

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-void/70 p-3 backdrop-blur-md sm:items-center sm:p-6" onClick={closeAll}>
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="scanlines relative w-full max-w-3xl overflow-hidden rounded-2xl border border-signal/25 bg-[#04070a] shadow-[0_0_80px_-20px_rgb(139_224_78/0.35)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-subtle">guest@netanix: ~</span>
          </div>
          <button type="button" onClick={closeAll} aria-label="Close terminal" className="grid size-8 place-items-center rounded-lg text-subtle hover:bg-white/10 hover:text-fg"><X className="size-4" /></button>
        </div>
        <div className="h-[60vh] max-h-[460px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:p-5" onClick={() => document.getElementById("term-in")?.focus()}>
          {lines.map((l, i) => (
            <p key={i} className={l.kind === "in" ? "text-fg" : l.kind === "ok" ? "text-signal" : l.kind === "err" ? "text-alert" : "whitespace-pre-wrap text-muted"}>
              {l.kind === "in" && <span className="text-signal">❯ </span>}{l.text}
            </p>
          ))}
          <form onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); setHi(-1); }} className="mt-1 flex items-center gap-2">
            <label htmlFor="term-in" className="text-signal">❯</label>
            <input
              id="term-in"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(hi + 1, history.length - 1); setHi(n); setValue(history[n] ?? ""); }
                if (e.key === "ArrowDown") { e.preventDefault(); const n = Math.max(hi - 1, -1); setHi(n); setValue(n < 0 ? "" : history[n]); }
              }}
              className="flex-1 bg-transparent text-fg caret-signal outline-none"
              aria-label="Terminal command"
            />
          </form>
          <div ref={end} />
        </div>
      </m.div>
    </m.div>
  );
}
