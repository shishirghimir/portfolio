import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Flag, ShieldCheck } from "lucide-react";
import { SiTryhackme } from "react-icons/si";
import { Hero } from "@/components/sections/Hero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CrewStrip, SkillsMatrix, TechMarquee, Timeline, WinsGrid } from "@/components/sections/Blocks";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { Logo3D } from "@/components/visuals/Logo3D";
import { JsonLd } from "@/components/JsonLd";
import { ContactBand } from "@/components/sections/ContactBand";
import { certs, links, person, stats } from "@/content/profile";
import { projects } from "@/content/projects";
import { writeups } from "@/content/writeups";
import { graph, itemListSchema, pageMeta, profilePageSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shishir Ghimire | Founder & CEO of Netanix Lab, Cybersecurity Engineer",
  description: "Shishir Ghimire (NetaNix), founder and CEO of Netanix Lab in Kathmandu: cybersecurity engineer, CTF creator and founder of NetanixCTF. Work, wins and contact.",
  path: "/",
  type: "profile",
  keywords: ["Shishir Ghimire", "Netanix Lab CEO", "cybersecurity engineer Nepal", "ethical hacker Nepal", "CTF Nepal", "NetanixCTF founder"],
});

const LOGOS = [
  { name: "Netanix Lab", src: "/brand/mark-light.webp", dark: true, href: links.netanixlab },
  { name: "NetanixCTF", src: "/logos/netanixctf-logo.webp", href: links.netanixctf },
  { name: "Black Hat MEA", src: "/logos/blackhat-mea.webp", dark: true },
  { name: "HackAstra", src: "/logos/hackastra.webp", dark: true },
];

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const certCount = certs.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <JsonLd data={graph(profilePageSchema("/", "Shishir Ghimire"), itemListSchema("Selected work", featured.map((p) => ({ name: p.name, path: `/work/${p.slug}/` }))))} />
      <Hero />

      {/* ---- recognised by ---- */}
      <section aria-label="Recognised by" className="border-y border-white/[0.06] bg-ink-950/60">
        <div className="container-x flex flex-col items-center gap-6 py-8 lg:flex-row lg:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Building, competing and recognised with</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {LOGOS.map((l) => (
              <li key={l.name} className="flex items-center gap-2.5 text-sm text-muted">
                <span className={`grid size-9 place-items-center overflow-hidden rounded-lg border border-white/10 ${l.dark ? "bg-black" : "bg-white p-1"}`}>
                  <Image src={l.src} alt={`${l.name} logo`} width={36} height={36} className="h-full w-full object-contain p-0.5" />
                </span>
                {l.name}
              </li>
            ))}
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-black"><SiTryhackme className="size-5 text-[#c11111]" aria-hidden /></span>
              TryHackMe Top 1%
            </li>
          </ul>
        </div>
      </section>

      {/* ---- numbers ---- */}
      <section className="container-x mt-20" aria-label="At a glance">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-void p-6 sm:p-8">
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl"><Counter to={s.value} prefix={s.prefix} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- 01 profile ---- */}
      <section className="container-x mt-32 grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]" aria-labelledby="profile-title">
        <div>
          <SectionHead id="profile-title" index="01" kicker="Operator profile" title={<>I lead the team that builds it, and I&apos;m the one who tries to break it.</>} />
          <div className="prose-x mt-6 max-w-2xl">
            <p>I&apos;m <strong>Shishir Ghimire</strong>, known online as <strong>NetaNix</strong>. As founder and CEO of <strong>Netanix Lab</strong> I set the direction, win and lead our client work, and architect the systems we ship, from cloud billing for retail shops to the platform that runs an interior design company&apos;s whole crew.</p>
            <p>Security is where I started. I founded <strong>NetanixCTF</strong> in 2024, design challenges across web, forensics, OSINT and crypto, rank in the global top 1% on TryHackMe, and qualified with our team for the <strong>Black Hat MEA 2026</strong> finals. Every system we build gets attacked by us before anyone else gets the chance.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/about/" variant="ghost">Full story</Button>
            <Button href="/contact/">Start a conversation</Button>
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
                {[["Role", "Founder & CEO"], ["Company", "Netanix Lab"], ["Focus", "Offence + build"], ["Study", "BSc Ethical Hacking"], ["Base", "Kathmandu"], ["Motto", "Break · Fix · Secure"]].map(([k, v]) => (
                  <div key={k}><dt className="text-subtle">{k}</dt><dd className="mt-0.5 text-fg">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- 02 ventures ---- */}
      <section className="container-x mt-32" aria-labelledby="ventures-title">
        <SectionHead id="ventures-title" index="02" kicker="Ventures" title="Two companies, one mission: secure software for Nepal." />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="group relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-ink-900/70 p-7 sm:p-10">
            <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-signal/[0.08] blur-3xl" />
            <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_200px]">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-signal"><Building2 className="size-4" aria-hidden />Founder & CEO · since {person.founded}</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-fg">Netanix Lab</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">A registered software company in Kathmandu building websites, billing and POS systems, mobile apps and custom platforms, with a security team behind every build. I lead an eight person crew and own architecture and client delivery.</p>
                <ul className="mt-6 flex flex-wrap gap-2 text-xs">
                  {["NLab Billing", "OMH Nepal", "IOS Nepal", "BM Mobile Zone", "Base Camp Adventure"].map((x) => <li key={x} className="rounded-full border border-white/10 px-3 py-1 text-muted">{x}</li>)}
                </ul>
                <a href={links.netanixlab} target="_blank" rel="noopener" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:text-signal-300">Visit netanixlab.com <ArrowUpRight className="size-4" aria-hidden /></a>
              </div>
              <Logo3D className="mx-auto aspect-square w-full max-w-[220px]" />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="group relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-ink-900/70 p-7 sm:p-10">
            <div aria-hidden className="absolute -bottom-24 -left-24 size-80 rounded-full bg-data/[0.07] blur-3xl" />
            <div className="relative">
              <span className="grid size-14 place-items-center rounded-2xl bg-white p-1.5"><Image src="/logos/netanixctf-logo.webp" alt="NetanixCTF logo" width={56} height={56} className="h-full w-full object-contain" /></span>
              <p className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-data"><Flag className="size-4" aria-hidden />Founder · since 2024</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-fg">NetanixCTF</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">Nepal&apos;s own Capture The Flag platform and community. 500+ registered players, 100+ certificates issued and live events run with colleges like Softwarica.</p>
              <a href={links.netanixctf} target="_blank" rel="noopener" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-data hover:text-fg">Play on netanixctf.com <ArrowUpRight className="size-4" aria-hidden /></a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- 03 work ---- */}
      <section className="container-x mt-32" aria-labelledby="work-title">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead id="work-title" index="03" kicker="Selected work" title="Systems I've led, shipped and secured." lead="Products we run, client systems in daily use, and the security tools I build for the work. Every project credits the people who built it with me." />
          <Button href="/work/" variant="ghost" className="shrink-0">All {projects.length} projects</Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08} className="h-full"><ProjectCard p={p} large /></Reveal>
          ))}
        </div>
      </section>

      {/* ---- 04 wins ---- */}
      <section className="container-x mt-32" aria-labelledby="wins-title">
        <SectionHead id="wins-title" index="04" kicker="Recognition" title="Wins on the scoreboard and off it." />
        <div className="mt-12"><WinsGrid /></div>
      </section>

      {/* ---- 05 timeline ---- */}
      <section className="container-x mt-32 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="road-title">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="road-title" index="05" kicker="Experience" title="The road so far." lead="From +2 computer science to founding a company, with security research the whole way through." />
        </div>
        <Timeline />
      </section>

      {/* ---- 06 arsenal ---- */}
      <section className="mt-32" aria-labelledby="arsenal-title">
        <div className="container-x">
          <SectionHead id="arsenal-title" index="06" kicker="Arsenal" title="Offence, defence and the engineering to ship it." />
          <div className="mt-12"><SkillsMatrix /></div>
        </div>
        <div className="mt-10"><TechMarquee /></div>
      </section>

      {/* ---- 07 crew ---- */}
      <section className="container-x mt-32" aria-labelledby="crew-title">
        <SectionHead id="crew-title" index="07" kicker="The crew" title="Nothing here was built alone." lead="The Netanix Lab team I lead. Each project page credits who owned which part." />
        <div className="mt-12"><CrewStrip /></div>
      </section>

      {/* ---- 08 writing + credentials ---- */}
      <section className="container-x mt-32 grid gap-5 lg:grid-cols-2" aria-label="Writing and credentials">
        <Reveal className="rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">08 · Research</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">Writeups</h2>
          <ul className="mt-6 divide-y divide-white/[0.06]">
            {writeups.slice(0, 3).map((w) => (
              <li key={w.url}><a href={w.url} target="_blank" rel="noopener" className="group flex items-start justify-between gap-4 py-4"><span><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{w.platform}</span><span className="mt-1 block text-fg group-hover:text-signal">{w.title}</span></span><ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle" aria-hidden /></a></li>
            ))}
          </ul>
          <Link href="/writeups/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-signal hover:text-signal-300">All writeups <ArrowRight className="size-4" aria-hidden /></Link>
        </Reveal>
        <Reveal delay={0.08} className="rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7 sm:p-9">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal">09 · Credentials</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{certCount} certifications</h2>
          <ul className="mt-6 space-y-4">
            {certs.map((c) => (
              <li key={c.issuer} className="flex items-start gap-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden />
                <span><span className="block text-fg">{c.issuer}</span><span className="mt-0.5 block text-sm text-muted">{c.items.slice(0, 3).join(" · ")}{c.items.length > 3 ? ` · +${c.items.length - 3} more` : ""}</span></span>
              </li>
            ))}
          </ul>
          <Link href="/certifications/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-signal hover:text-signal-300">See all credentials <ArrowRight className="size-4" aria-hidden /></Link>
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}
