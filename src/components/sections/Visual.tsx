import Image from "next/image";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/** The picture for a project: a browser frame with a real screenshot, a client logo, or a terminal readout for tools. */
export function Visual({ p, priority, className }: { p: Project; priority?: boolean; className?: string }) {
  if (p.cover) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)} style={{ background: `radial-gradient(circle at 70% 0%, ${p.accent}33, transparent 60%), #0a0d12` }}>
        <div className="absolute inset-x-[6%] top-[12%] overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-ink-900 shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2">
            <span className="size-2 rounded-full bg-white/20" /><span className="size-2 rounded-full bg-white/20" /><span className="size-2 rounded-full bg-white/20" />
            {p.cover.url && <span className="ml-2 truncate font-mono text-[10px] text-subtle">{p.cover.url}</span>}
          </div>
          <div className="relative aspect-[16/10]">
            <Image src={p.cover.desktop} alt={`${p.name} screenshot`} fill priority={priority} sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
          </div>
        </div>
      </div>
    );
  }
  if (p.terminal) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-[#05080b] p-5 sm:p-6", className)} style={{ background: `radial-gradient(circle at 80% 0%, ${p.accent}26, transparent 55%), #05080b` }}>
        <div className="font-mono text-[11.5px] leading-[1.9] sm:text-xs">
          {p.terminal.map((l, i) => (
            <p key={i} className={cn("truncate", i === 0 ? "text-fg" : l.includes("✓") ? "text-signal" : l.startsWith("[!]") ? "text-alert" : "text-muted")}>{l}</p>
          ))}
          <p className="mt-1 text-signal">❯ <span className="inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-signal" /></p>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("relative grid h-full w-full place-items-center overflow-hidden", className)} style={{ background: `radial-gradient(circle at 50% 30%, ${p.accent}30, transparent 65%), #0a0d12` }}>
      <div aria-hidden className="grid-bg absolute inset-0 opacity-40" />
      {p.logo && (
        <span className="relative grid size-28 place-items-center rounded-3xl bg-white p-3 shadow-2xl transition-transform duration-700 group-hover:scale-105">
          <Image src={p.logo} alt={`${p.name} logo`} width={112} height={112} className="h-full w-full object-contain" />
        </span>
      )}
    </div>
  );
}
