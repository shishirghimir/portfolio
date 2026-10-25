import Image from "next/image";
import { ArrowUpRight, Trophy } from "lucide-react";
import { SiTryhackme } from "react-icons/si";
import { Reveal } from "@/components/motion/Reveal";
import { achievements, links, type Achievement } from "@/content/profile";
import { cn } from "@/lib/cn";

export function AchievementLogo({ a, className }: { a: Achievement; className?: string }) {
  if ("icon" in a.logo) return <SiTryhackme className={cn("size-10 text-[#e0262b]", className)} aria-hidden />;
  return <Image src={a.logo.src} alt={`${a.title} logo`} width={a.logo.wide ? 200 : 64} height={64} className={cn("h-full w-auto object-contain", className)} />;
}

/** The Black Hat MEA finals: the headline achievement, shown big. */
export function FeaturedAchievement() {
  const a = achievements.find((x) => x.featured)!;
  return (
    <Reveal className="spot relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/80">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgb(139_224_78/0.16),transparent_55%),radial-gradient(circle_at_0%_100%,rgb(56_214_255/0.10),transparent_50%)]" />
      <div aria-hidden className="grid-bg fade-mask absolute inset-0 opacity-50" />
      <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
            <Trophy className="size-3.5" aria-hidden />{a.kind} · {a.when}
          </p>
          <div className="mt-7 h-12 sm:h-14"><AchievementLogo a={a} /></div>
          <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">{a.title}: <span className="glow text-signal">{a.result}</span></h3>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{a.summary}</p>
        </div>
        <dl className="grid gap-3">
          {[["Where", a.where], ...a.facts].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-void/50 px-5 py-4 backdrop-blur">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{k}</dt>
              <dd className="text-right text-sm font-medium text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}

/** Every other achievement as a card with its real logo and the key numbers. */
export function AchievementGrid({ limit }: { limit?: number }) {
  const list = achievements.filter((x) => !x.featured).slice(0, limit);
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {list.map((a, i) => (
        <Reveal as="li" key={a.slug} delay={(i % 3) * 0.06} className="spot group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6 transition-colors hover:border-signal/30">
          <div className="flex items-start justify-between gap-4">
            <span className={cn("grid h-16 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black/60", "src" in a.logo && a.logo.wide ? "w-40 px-4" : "w-16 p-1.5")}>
              <AchievementLogo a={a} className="max-h-12 max-w-full" />
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{a.kind}</span>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{a.title}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{a.result}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{a.summary}</p>
          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
            {a.facts.map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-subtle">{k}</dt><dd className="mt-1 text-sm font-semibold text-fg">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-4 flex items-center justify-between font-mono text-[11px] text-signal-300">
            <span>{a.when} · {a.where}</span>
            {a.href && <a href={a.href} target="_blank" rel="noopener" aria-label={`${a.title} website`} className="text-subtle hover:text-signal"><ArrowUpRight className="size-4" aria-hidden /></a>}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}

/** Live TryHackMe badge, always current. */
export function TryHackMeBadge() {
  return (
    <a href={links.tryhackme} target="_blank" rel="noopener" className="spot group block overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6 transition-colors hover:border-[#e0262b]/40">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle"><SiTryhackme className="size-4 text-[#e0262b]" aria-hidden />Live TryHackMe badge</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://tryhackme-badges.s3.amazonaws.com/N3TANIX.png" alt="TryHackMe profile badge for N3TANIX: rank, level, badges and rooms" width={329} height={88} loading="lazy" className="mt-4 w-full max-w-[329px] rounded-lg" />
      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted group-hover:text-fg">View the profile <ArrowUpRight className="size-4" aria-hidden /></p>
    </a>
  );
}
