import { ArrowUpRight } from "lucide-react";
import { SiHackthebox, SiTryhackme } from "react-icons/si";
import { PageHead } from "@/components/sections/Blocks";
import { ContactBand } from "@/components/sections/ContactBand";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { links } from "@/content/profile";
import { writeups } from "@/content/writeups";
import { breadcrumbSchema, graph, itemListSchema, pageMeta, webPageSchema } from "@/lib/seo";

const TITLE = "Security writeups: HackTheBox and TryHackMe";
const DESC = "CTF and box walkthroughs by Shishir Ghimire (N3TANIX): web enumeration, Docker escapes, IDOR and the fixes that would have stopped each attack.";

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/writeups/", image: "/og/writeups.png", keywords: ["HackTheBox writeup", "TryHackMe writeup", "CTF writeups Nepal"] });

export default function WriteupsPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema("/writeups/", TITLE, DESC, "CollectionPage"), breadcrumbSchema([{ name: "Writeups", path: "/writeups/" }]), itemListSchema("Writeups", writeups.map((w) => ({ name: w.title, path: "/writeups/" }))))} />
      <PageHead kicker="Research" title={<>Writeups from <span className="text-signal">the lab.</span></>} lead="Walkthroughs of boxes and rooms I have broken, with the defensive lesson in each one. Full posts live on Medium." crumbs={[{ name: "Writeups", path: "/writeups/" }]} />
      <section className="container-x">
        <ul className="grid gap-5 md:grid-cols-2">
          {writeups.map((w, i) => (
            <Reveal as="li" key={w.url} delay={i * 0.06}>
              <article className="group flex h-full flex-col rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7 transition-colors hover:border-white/20">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-signal">
                    {w.platform === "HackTheBox" ? <SiHackthebox className="size-4" aria-hidden /> : <SiTryhackme className="size-4" aria-hidden />}
                    {w.platform}{w.level ? ` · ${w.level}` : ""}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-fg">{w.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{w.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">{w.tags.map((t) => <li key={t} className="rounded-md border border-white/[0.08] px-2 py-0.5 font-mono text-[11px] text-subtle">{t}</li>)}</ul>
                <a href={w.url} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:text-signal-300">Read on Medium <ArrowUpRight className="size-4" aria-hidden /></a>
              </article>
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-white/[0.08] bg-ink-900/40 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">New breakdowns go up on Medium first. Follow along as <span className="text-fg">@netanix96</span>.</p>
          <Button href={links.medium} variant="ghost">Follow on Medium</Button>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
