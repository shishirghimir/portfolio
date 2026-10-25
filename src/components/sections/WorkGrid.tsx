"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { kindLabel, type Kind, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

const FILTERS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "product", label: "Products" },
  { key: "client", label: "Client systems" },
  { key: "security", label: "Security tools" },
  { key: "research", label: "Research" },
];

/** Filterable project grid. Cards are rendered on the server and passed in as children. */
export function WorkGrid({ projects, cards }: { projects: Pick<Project, "slug" | "kind">[]; cards: Record<string, React.ReactNode> }) {
  const [f, setF] = useState<(typeof FILTERS)[number]["key"]>("all");
  const shown = useMemo(() => (f === "all" ? projects : projects.filter((p) => p.kind === f)), [f, projects]);
  return (
    <>
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {FILTERS.map((x) => {
          const count = x.key === "all" ? projects.length : projects.filter((p) => p.kind === x.key).length;
          return (
            <button key={x.key} role="tab" aria-selected={f === x.key} onClick={() => setF(x.key)} className={cn("relative isolate rounded-full px-4 py-2 text-sm transition-colors", f === x.key ? "text-on-signal" : "border border-white/10 text-muted hover:text-fg")}>
              {f === x.key && <m.span layoutId="work-filter" className="absolute inset-0 -z-10 rounded-full bg-signal" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {x.label}<span className={cn("ml-2 font-mono text-xs", f === x.key ? "text-on-signal/70" : "text-subtle")}>{count}</span>
            </button>
          );
        })}
      </div>
      <m.ul layout className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <m.li key={p.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}>
              {cards[p.slug]}
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
      <p className="sr-only">Categories: {Object.values(kindLabel).join(", ")}</p>
    </>
  );
}
