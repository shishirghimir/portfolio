import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Crown } from "lucide-react";
import { PageHead } from "@/components/sections/Blocks";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Visual } from "@/components/sections/Visual";
import { ContactBand } from "@/components/sections/ContactBand";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { getProject, kindLabel, projects } from "@/content/projects";
import { team } from "@/content/team";
import { person } from "@/content/profile";
import { breadcrumbSchema, graph, pageMeta, projectSchema, webPageSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

/** Trim to a word boundary for titles and descriptions. */
const clip = (t: string, n: number) => (t.length <= n ? t : `${t.slice(0, n).replace(/\s+\S*$/, "")}...`);

export async function generateMetadata({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name}: ${kindLabel[p.kind]} by Shishir Ghimire`, description: clip(p.summary, 158), path: `/work/${p.slug}/`, image: `/og/work-${p.slug}.png`, keywords: [p.name, ...p.stack] });
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const path = `/work/${p.slug}/`;
  const others = projects.filter((x) => x.slug !== p.slug && (x.kind === p.kind || x.featured)).slice(0, 3);

  return (
    <>
      <JsonLd data={graph(webPageSchema(path, p.name, p.summary), breadcrumbSchema([{ name: "Work", path: "/work/" }, { name: p.name, path }]), projectSchema(p))} />
      <PageHead kicker={`${kindLabel[p.kind]} · ${p.year} · ${p.status}`} title={p.name} lead={p.tagline} crumbs={[{ name: "Work", path: "/work/" }, { name: p.name, path }]} />

      <section className="container-x">
        <div data-rise style={{ animationDelay: "0.1s" }} className="group overflow-hidden rounded-[2rem] border border-white/[0.08]">
          <div className="relative aspect-[16/10] sm:aspect-[16/8]"><Visual p={p} priority /></div>
        </div>
      </section>

      <section className="container-x mt-14 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <div className="rounded-2xl border border-signal/25 bg-signal/[0.05] p-6">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-signal"><Crown className="size-4" aria-hidden />My role</p>
            <p className="mt-3 text-xl font-semibold text-fg">{p.role}</p>
            <p className="mt-2 text-sm text-muted">{person.name}{p.kind === "product" || p.kind === "client" ? ", Founder & CEO of Netanix Lab" : ""}</p>
          </div>
          <div className="prose-x mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Overview</h2>
            <p>{p.summary}</p>
            <h2 className="mt-10 text-2xl font-semibold tracking-tight text-fg">The problem</h2>
            <p>{p.problem}</p>
            <h2 className="mt-10 text-2xl font-semibold tracking-tight text-fg">How we approached it</h2>
            <p>{p.approach}</p>
          </div>
          <h2 className="mt-10 text-2xl font-semibold tracking-tight text-fg">What it does</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {p.highlights.map((h) => <li key={h} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-ink-900/60 p-4 text-sm text-fg/90"><Check className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />{h}</li>)}
          </ul>
          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-fg">Results</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {p.outcomes.map((o) => <li key={o} className="rounded-xl border border-white/[0.07] bg-ink-900/60 p-5"><span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Outcome</span><span className="mt-2 block text-sm font-medium leading-snug text-fg">{o}</span></li>)}
          </ul>
          {p.gallery && (
            <>
              <h2 className="mt-12 text-2xl font-semibold tracking-tight text-fg">Screens</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {p.gallery.map((g) => (
                  <Reveal as="li" key={g.src}>
                    <a href={g.src} target="_blank" rel="noopener" className="group block overflow-hidden rounded-xl border border-white/[0.08] bg-ink-900">
                      <span className="relative block aspect-[16/10]"><Image src={g.src} alt={`${p.name}: ${g.caption}`} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" /></span>
                      <span className="block px-4 py-3 text-sm text-muted">{g.caption}</span>
                    </a>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {p.client && (
            <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Client</p>
              <div className="mt-3 flex items-center gap-3">
                {p.logo && <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-white"><Image src={p.logo} alt="" fill sizes="44px" className="object-contain p-1" /></span>}
                <p className="text-sm text-fg">{p.client}</p>
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Team credits</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-signal/60"><Image src="/photos/dusk-sm.webp" alt={person.name} fill sizes="40px" className="object-cover object-top" /></span>
                <span className="min-w-0"><span className="block text-sm font-medium text-fg">{person.name}</span><span className="block text-xs text-signal-300">{p.role}</span></span>
              </li>
              {p.credits.map((c) => {
                const m = team[c.mate];
                return (
                  <li key={c.mate}>
                    <a href={m.href} target="_blank" rel="noopener" className="group flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15"><Image src={m.photo} alt={m.name} fill sizes="40px" className="object-cover" /></span>
                      <span className="min-w-0"><span className="block text-sm text-fg group-hover:text-signal">{m.name} <span className="text-subtle">· {m.role}</span></span><span className="block text-xs text-muted">{c.for}</span></span>
                    </a>
                  </li>
                );
              })}
            </ul>
            {!p.credits.length && <p className="mt-3 text-xs text-subtle">Designed and built solo.</p>}
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Built with</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{p.stack.map((t) => <li key={t} className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[11px] text-muted">{t}</li>)}</ul>
          </div>
          {p.links.length > 0 && (
            <div className="space-y-2">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fg transition-colors hover:border-signal/40">
                  {l.label}<ArrowUpRight className="size-4 text-signal" aria-hidden />
                </a>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="container-x mt-24">
        <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <h2 className="text-2xl font-semibold tracking-tight text-fg">More work</h2>
          <Link href="/work/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft className="size-4" aria-hidden />All projects</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{others.map((o) => <ProjectCard key={o.slug} p={o} />)}</div>
      </section>
      <ContactBand />
    </>
  );
}
