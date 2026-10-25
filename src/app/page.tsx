import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Flag, ShieldCheck } from "lucide-react";
import { SiTryhackme } from "react-icons/si";
import { Hero } from "@/components/sections/Hero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CrewStrip, TechMarquee, Timeline, Toolbox } from "@/components/sections/Blocks";
import { AchievementGrid, FeaturedAchievement } from "@/components/sections/Achievements";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { Logo3D } from "@/components/visuals/Logo3D";
import { JsonLd } from "@/components/JsonLd";
import { ContactBand } from "@/components/sections/ContactBand";
import { achievements, certs, links, person, stats } from "@/content/profile";
import { projects } from "@/content/projects";
import { writeups } from "@/content/writeups";
import { graph, itemListSchema, pageMeta, profilePageSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shishir Ghimire | Cybersecurity Engineer & CTF Creator, Nepal",
  description: "Shishir Ghimire (NetaNix): cybersecurity engineer and CTF creator from Kathmandu, Black Hat MEA 2026 finalist, TryHackMe top 1% and founder of Netanix Lab.",
  path: "/",
  type: "profile",
  keywords: ["Shishir Ghimire", "NetaNix", "N3TANIX", "cybersecurity engineer Nepal", "ethical hacker Nepal", "CTF player Nepal", "Black Hat MEA 2026 Nepal", "Netanix Lab founder"],
});

const LOGOS: { name: string; src: string; w: number; h: number }[] = [
  { name: "Black Hat MEA", src: "/logos/blackhat-white.webp", w: 120, h: 34 },
  { name: "HackAstra", src: "/logos/hackastra.webp", w: 62, h: 45 },
  { name: "Coventry University", src: "/logos/coventry-white.webp", w: 120, h: 34 },
  { name: "Softwarica College", src: "/logos/softwarica-white.webp", w: 130, h: 34 },
  { name: "NetanixCTF", src: "/logos/netanixctf-logo.webp", w: 36, h: 36 },
];

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const certCount = certs.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <JsonLd data={graph(profilePageSchema("/", "Shishir Ghimire"), itemListSchema("Achievements", achievements.map((a) => ({ name: `${a.title}: ${a.result}`, path: "/achievements/" }))), itemListSchema("Selected projects", featured.map((p) => ({ name: p.name, path: `/work/${p.slug}/` }))))} />
      <Hero />

      {/* ---- logo wall ---- */}
      <section aria-label="Competed, studied and built with" className="border-y border-white/[0.06] bg-ink-950/50 backdrop-blur-sm">
        <div className="container-x flex flex-col items-center gap-7 py-9 lg:flex-row lg:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Competed, studied and built with</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {LOGOS.map((l) => (
              <li key={l.name} title={l.name} className="opacity-75 transition-opacity duration-300 hover:opacity-100">
                <Image src={l.src} alt={`${l.name} logo`} width={l.w} height={l.h} className="h-9 w-auto rounded-md object-contain" />
              </li>
            ))}
            <li title="TryHackMe" className="flex items-center gap-2 text-sm font-semibold text-fg/80 opacity-80 transition-opacity hover:opacity-100">
              <SiTryhackme className="size-7 text-[#e0262b]" aria-hidden />TryHackMe
            </li>
          </ul>
        </div>
      </section>

      {/* ---- numbers ---- */}
      <section className="container-x mt-20" aria-label="At a glance">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-void/90 p-6 sm:p-8">
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl"><Counter to={s.value} prefix={s.prefix} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- 01 about ---- */}
      <section className="container-x mt-28 grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]" aria-labelledby="about-title">
        <div>
          <SectionHead id="about-title" index="01" kicker="About me" title={<>I break things to learn how to build them <span className="text-signal">properly.</span></>} />
          <div className="prose-x mt-6 max-w-2xl">
            <p>I&apos;m <strong>Shishir Ghimire</strong>, better known online as <strong>NetaNix</strong>. I got into security the way most of us do: one CTF room at a time, late at night, until I could not stop. Today I rank in the global <strong>top 1% on TryHackMe</strong>, I design challenges for Nepal&apos;s CTF scene, and our team is heading to the <strong>Black Hat MEA 2026</strong> finals in Riyadh.</p>
            <p>Breaking systems taught me how to build them. In 2024 I created <strong>NetanixCTF</strong> for Nepal&apos;s security community, and I founded <strong>Netanix Lab</strong>, where I design and lead the software real businesses rely on, with security reviewed at every step. I&apos;m also studying Ethical Hacking and Cybersecurity at Softwarica College, awarded by Coventry University.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/about/" variant="ghost">My full story</Button>
            <Button href="/contact/">Get in touch</Button>
          </div>
        </div>
        <Reveal className="relative">
          <div className="brackets overflow-hidden rounded-[1.6rem] border border-white/10 bg-ink-900 p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] scanlines">
              <picture>
                <source type="image/avif" srcSet="/photos/cyber-sm.avif 640w, /photos/cyber.avif 675w" sizes="(min-width: 1024px) 40vw, 90vw" />
                <img src="/photos/cyber.webp" alt="Shishir Ghimire, cybersecurity engineer" width={675} height={900} loading="lazy" className="h-full w-full object-cover" />
              </picture>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
              <dl className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-x-4 gap-y-3 p-5 font-mono text-[11px] uppercase tracking-[0.12em] sm:grid-cols-3 [&>div:nth-child(n+5)]:hidden sm:[&>div:nth-child(n+5)]:block">
                {[["Alias", "NetaNix"], ["Focus", "Offensive security"], ["THM", "Top 1% · N3TANIX"], ["Study", "BSc Ethical Hacking"], ["Base", "Kathmandu"], ["Motto", "Break · Fix · Secure"]].map(([k, v]) => (
                  <div key={k}><dt className="text-subtle">{k}</dt><dd className="mt-0.5 text-fg">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- 02 achievements ---- */}
      <section className="container-x mt-28" aria-labelledby="ach-title">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead id="ach-title" index="02" kicker="Achievements" title="On the scoreboard, and building the scoreboard." lead="International finals, national podiums, a top 1% ranking and a CTF platform of my own." />
          <Button href="/achievements/" variant="ghost" className="shrink-0">All achievements</Button>
        </div>
        <div className="mt-12"><FeaturedAchievement /></div>
        <div className="mt-4"><AchievementGrid limit={3} /></div>
      </section>

      {/* ---- 03 projects ---- */}
      <section className="container-x mt-28" aria-labelledby="work-title">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead id="work-title" index="03" kicker="Projects" title="Things I've built, led and secured." lead="Platforms I run, systems businesses use every day and the security tools I make for my own work. Every project credits the people who built it with me." />
          <Button href="/work/" variant="ghost" className="shrink-0">All {projects.length} projects</Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08} className="h-full"><ProjectCard p={p} large /></Reveal>
          ))}
        </div>
      </section>

      {/* ---- 04 skills ---- */}
      <section className="mt-28" aria-labelledby="skills-title">
        <div className="container-x">
          <SectionHead id="skills-title" index="04" kicker="Skills" title="Offence, defence and the engineering to ship it." />
          <div className="mt-12"><Toolbox /></div>
        </div>
        <div className="mt-10"><TechMarquee /></div>
      </section>

      {/* ---- 05 experience ---- */}
      <section className="container-x mt-28 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="road-title">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="road-title" index="05" kicker="Experience" title="The road so far." lead="From +2 computer science to international finals and a company of my own." />
        </div>
        <Timeline />
      </section>

      {/* ---- 06 what I founded ---- */}
      <section className="container-x mt-28" aria-labelledby="ventures-title">
        <SectionHead id="ventures-title" index="06" kicker="What I founded" title="Two things I started, and still lead." />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="spot group relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-ink-900/70 p-7 sm:p-10">
            <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-signal/[0.08] blur-3xl" />
            <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_200px]">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-signal"><Building2 className="size-4" aria-hidden />Founder & CEO · since {person.founded}</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-fg">Netanix Lab</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">My software company in Kathmandu. We build websites, billing and POS systems, apps and custom platforms for Nepali businesses, and every one is attacked by us before it goes live.</p>
                <ul className="mt-6 flex flex-wrap gap-2 text-xs">
                  {["NLab Billing", "OMH Nepal", "IOS Nepal", "BM Mobile Zone", "Base Camp Adventure"].map((x) => <li key={x} className="rounded-full border border-white/10 px-3 py-1 text-muted">{x}</li>)}
                </ul>
                <a href={links.netanixlab} target="_blank" rel="noopener" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:text-signal-300">netanixlab.com <ArrowUpRight className="size-4" aria-hidden /></a>
              </div>
              <Logo3D className="mx-auto aspect-square w-full max-w-[220px]" />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="spot group relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-ink-900/70 p-7 sm:p-10">
            <div aria-hidden className="absolute -bottom-24 -left-24 size-80 rounded-full bg-data/[0.07] blur-3xl" />
            <div className="relative">
              <span className="grid size-14 place-items-center rounded-2xl bg-white p-1.5"><Image src="/logos/netanixctf-logo.webp" alt="NetanixCTF logo" width={56} height={56} className="h-full w-full object-contain" /></span>
              <p className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-data"><Flag className="size-4" aria-hidden />Founder · since 2024</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-fg">NetanixCTF</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">The Capture The Flag platform I built for Nepal. 500+ registered players, 100+ certificates and live events with colleges like Softwarica.</p>
              <a href={links.netanixctf} target="_blank" rel="noopener" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-data hover:text-fg">Play on netanixctf.com <ArrowUpRight className="size-4" aria-hidden /></a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- 07 crew ---- */}
      <section className="container-x mt-28" aria-labelledby="crew-title">
        <SectionHead id="crew-title" index="07" kicker="People I build with" title="Nothing here was built alone." lead="The team behind the products and client work on this site. Each project page credits who owned which part." />
        <div className="mt-12"><CrewStrip /></div>
      </section>

      {/* ---- 08 writing + credentials ---- */}
      <section className="container-x mt-28 grid gap-5 lg:grid-cols-2" aria-label="Writing and credentials">
        <Reveal className="spot rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">08 · Writeups</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">From my lab notebook</h2>
          <ul className="mt-6 divide-y divide-white/[0.06]">
            {writeups.slice(0, 3).map((w) => (
              <li key={w.url}><a href={w.url} target="_blank" rel="noopener" className="group flex items-start justify-between gap-4 py-4"><span><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{w.platform}</span><span className="mt-1 block text-fg group-hover:text-signal">{w.title}</span></span><ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle" aria-hidden /></a></li>
            ))}
          </ul>
          <Link href="/writeups/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-signal hover:text-signal-300">All writeups <ArrowRight className="size-4" aria-hidden /></Link>
        </Reveal>
        <Reveal delay={0.08} className="spot rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">09 · Certifications</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{certCount} certifications</h2>
          <ul className="mt-6 space-y-4">
            {certs.map((c) => (
              <li key={c.issuer} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-black/60 p-1.5">
                  {c.logo ? <Image src={c.logo} alt={`${c.issuer} logo`} width={32} height={32} className="h-full w-full object-contain" /> : <ShieldCheck className="size-5 text-signal" aria-hidden />}
                </span>
                <span><span className="block text-fg">{c.issuer}</span><span className="mt-0.5 block text-sm text-muted">{c.items.slice(0, 3).join(" · ")}{c.items.length > 3 ? ` · +${c.items.length - 3} more` : ""}</span></span>
              </li>
            ))}
          </ul>
          <Link href="/certifications/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-signal hover:text-signal-300">See all certifications <ArrowRight className="size-4" aria-hidden /></Link>
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}
