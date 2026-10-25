import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import * as Si from "react-icons/si";
import { Reveal } from "@/components/motion/Reveal";
import { experience, toolbox, type Tool } from "@/content/profile";
import { crew } from "@/content/team";
import { cn } from "@/lib/cn";

/** Career timeline with a glowing rail. */
export function Timeline() {
  return (
    <ol className="relative ml-2 border-l border-white/[0.08] sm:ml-4">
      {experience.map((e, i) => (
        <Reveal as="li" key={e.title} delay={i * 0.05} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
            <span aria-hidden className={cn("absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 border-void", i === 0 ? "bg-signal shadow-[0_0_0_4px_rgb(139_224_78/0.2)]" : "bg-ink-800 ring-1 ring-white/20")} />
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">{e.when}</p>
              {e.logo && <Image src={e.logo} alt="" width={120} height={32} className="h-6 w-auto max-w-[120px] object-contain opacity-80" />}
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{e.title}</h3>
            <p className="mt-1 text-sm text-fg/70">{e.org} · {e.where}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">{e.body}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">{e.tags.map((t) => <li key={t} className="rounded-md border border-white/[0.08] px-2 py-0.5 font-mono text-[10.5px] text-subtle">{t}</li>)}</ul>
        </Reveal>
      ))}
    </ol>
  );
}

/** A tool tile: the real logo (local Devicon SVG or Simple Icons) and its name. */
function ToolIcon({ t }: { t: Tool }) {
  if (t.svg) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/tech/${t.svg}.svg`} alt="" width={28} height={28} loading="lazy" decoding="async" className={cn("size-7 object-contain", t.invert && "invert")} />;
  }
  const I = t.si ? (Si as Record<string, React.ComponentType<{ className?: string }>>)[t.si] : undefined;
  return I ? <I className="size-7 text-fg" /> : <span className="font-mono text-xs text-signal">{t.name.slice(0, 2)}</span>;
}

/** Skills grouped by discipline, every tool shown with its real logo. */
export function Toolbox() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {toolbox.map((g, i) => (
        <Reveal key={g.group} delay={(i % 2) * 0.06} className="spot h-full rounded-2xl border border-white/[0.08] bg-ink-900/60 p-6 sm:p-7">
          <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-signal"><span>{g.group}</span><span className="text-subtle">0{i + 1}</span></p>
          <p className="mt-2 text-sm text-muted">{g.blurb}</p>
          <ul className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {g.tools.map((t) => (
              <li key={t.name} className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/30 hover:bg-white/[0.04]">
                <span className="transition-transform duration-300 group-hover:scale-110"><ToolIcon t={t} /></span>
                <span className="text-[11.5px] leading-tight text-fg/80">{t.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

const TECH = ["python", "typescript", "javascript", "react", "nextjs", "nodejs", "postgresql", "prisma", "sqlite", "docker", "linux", "kalilinux", "bash", "git", "github", "burpsuite", "wireshark", "fastapi", "tailwindcss", "nginx", "railway", "vercel", "cloudflare", "figma"];
const INVERT = new Set(["nextjs", "prisma", "bash", "github", "vercel", "railway"]);

/** Official tool logos sliding past, pauses on hover. */
export function TechMarquee() {
  const row = [...TECH, ...TECH];
  return (
    <div className="fade-x overflow-hidden">
      <ul className="flex w-max animate-marquee gap-3 py-1 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <li key={`${t}-${i}`} aria-hidden={i >= TECH.length} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/tech/${t}.svg`} alt="" width={20} height={20} loading="lazy" decoding="async" className={cn("size-5 object-contain", INVERT.has(t) && "invert")} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The Netanix Lab crew, credited by name with links to their profiles. */
export function CrewStrip() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {crew.map((m, i) => (
        <Reveal as="li" key={m.key} delay={i * 0.04} className="h-full">
            <a href={m.href} target="_blank" rel="noopener" className="group block h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/60 transition-colors hover:border-white/20">
              <span className="relative block aspect-square overflow-hidden">
                <Image src={m.photo} alt={`${m.name}, ${m.role} at Netanix Lab`} fill sizes="(min-width: 1024px) 12vw, 45vw" className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
              </span>
              <span className="block p-3">
                <span className="flex items-center justify-between gap-1 text-sm font-medium text-fg">{m.name}<ArrowUpRight className="size-3.5 shrink-0 text-subtle" aria-hidden /></span>
                <span className="mt-0.5 block text-xs leading-snug text-subtle">{m.role}</span>
              </span>
            </a>
        </Reveal>
      ))}
    </ul>
  );
}

/** Simple page heading for inner pages, with breadcrumbs. */
export function PageHead({ kicker, title, lead, crumbs }: { kicker: string; title: React.ReactNode; lead?: React.ReactNode; crumbs: { name: string; path: string }[] }) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-36">
      <div aria-hidden className="grid-bg fade-mask absolute inset-0 -z-10 opacity-50" />
      <div aria-hidden className="absolute -top-20 right-0 -z-10 size-[420px] rounded-full bg-signal/[0.06] blur-[120px]" />
      <div className="container-x">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-subtle">
            <li><Link href="/" className="hover:text-fg">~</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                <span>/</span>
                {i === crumbs.length - 1 ? <span aria-current="page" className="text-muted">{c.name.toLowerCase()}</span> : <Link href={c.path} className="hover:text-fg">{c.name.toLowerCase()}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <div data-rise className="mt-8 max-w-4xl">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-signal"><span className="h-px w-8 bg-signal/50" />{kicker}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-fg sm:text-6xl lg:text-7xl">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
