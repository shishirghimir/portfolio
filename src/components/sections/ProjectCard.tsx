import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { kindLabel, type Project } from "@/content/projects";
import { Visual } from "./Visual";
import { CreditFaces } from "./Credits";
import { cn } from "@/lib/cn";

export function ProjectCard({ p, large, priority }: { p: Project; large?: boolean; priority?: boolean }) {
  return (
    <Link href={`/work/${p.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-ink-900/70 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
      <div className={cn("relative overflow-hidden border-b border-white/[0.06]", large ? "aspect-[16/10]" : "aspect-[16/11]")}>
        <Visual p={p} priority={priority} />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-void/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur">{kindLabel[p.kind]}</span>
        <span className="absolute right-4 top-4 hidden sm:block rounded-full border border-white/10 bg-void/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted backdrop-blur">{p.year} · {p.status}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-semibold tracking-tight text-fg", large ? "text-2xl" : "text-xl")}>{p.name}</h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" aria-hidden />
        </div>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-300">{p.role}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-subtle sm:hidden">{p.year} · {p.status}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5">
            {p.stack.slice(0, large ? 4 : 3).map((t) => <li key={t} className="rounded-md border border-white/[0.08] px-2 py-0.5 font-mono text-[10.5px] text-subtle">{t}</li>)}
          </ul>
          <CreditFaces p={p} max={3} />
        </div>
      </div>
    </Link>
  );
}
