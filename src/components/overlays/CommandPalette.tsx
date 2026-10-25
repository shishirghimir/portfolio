"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, Copy, CornerDownLeft, FolderGit2, Search, SquareTerminal } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { NAV } from "@/content/nav";
import { person, socials } from "@/content/profile";
import { projects } from "@/content/projects";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/cn";

type Item = { group: string; label: string; hint?: string; icon: React.ReactNode; run: () => void };

export function CommandPalette() {
  const router = useRouter();
  const { closeAll, openTerminal } = useUI();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => { closeAll(); router.push(href); };
    const ext = (href: string) => () => { closeAll(); window.open(href, "_blank", "noopener"); };
    return [
      { group: "Actions", label: "Open the terminal", hint: "`", icon: <SquareTerminal className="size-4" />, run: openTerminal },
      { group: "Actions", label: "Copy email address", hint: person.email, icon: <Copy className="size-4" />, run: () => { navigator.clipboard?.writeText(person.email); closeAll(); } },
      { group: "Pages", label: "Home", icon: <ArrowRight className="size-4" />, run: go("/") },
      ...[...NAV, { href: "/contact/", label: "Contact" }].map((n) => ({ group: "Pages", label: n.label, icon: <ArrowRight className="size-4" />, run: go(n.href) })),
      ...projects.map((p) => ({ group: "Work", label: p.name, hint: p.role.split(" · ")[0], icon: <FolderGit2 className="size-4" />, run: go(`/work/${p.slug}/`) })),
      ...socials.map((s) => ({ group: "Profiles", label: s.label, hint: s.handle, icon: <BrandIcon name={s.key} className="size-4" />, run: ext(s.href) })),
    ];
  }, [closeAll, openTerminal, router]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(t)) : items;
  }, [items, q]);

  const move = (d: number) => {
    setSel((s) => {
      const n = (s + d + shown.length) % Math.max(shown.length, 1);
      list.current?.querySelectorAll("li")[n]?.scrollIntoView({ block: "nearest" });
      return n;
    });
  };

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center bg-void/75 px-4 pt-[12vh] backdrop-blur-md" onClick={closeAll}>
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
          <Search className="size-4 text-subtle" aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
              if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
              if (e.key === "Enter") shown[sel]?.run();
            }}
            placeholder="Search work, pages and profiles..."
            aria-label="Search"
            className="h-14 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
          />
          <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-subtle">ESC</kbd>
        </div>
        <ul ref={list} className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {shown.length === 0 && <li className="px-3 py-8 text-center text-sm text-subtle">No match for &ldquo;{q}&rdquo;</li>}
          {shown.map((it, i) => (
            <li key={`${it.group}-${it.label}`} role="option" aria-selected={i === sel}>
              {(i === 0 || shown[i - 1].group !== it.group) && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{it.group}</p>}
              <button type="button" onMouseEnter={() => setSel(i)} onClick={it.run} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors", i === sel ? "bg-white/[0.06] text-fg" : "text-muted")}>
                <span className={cn("grid size-8 place-items-center rounded-lg border border-white/[0.08]", i === sel && "border-signal/40 text-signal")}>{it.icon}</span>
                <span className="flex-1 truncate">{it.label}</span>
                {it.hint && <span className="truncate font-mono text-[11px] text-subtle">{it.hint}</span>}
                {i === sel && <CornerDownLeft className="size-3.5 text-subtle" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </m.div>
    </m.div>
  );
}
