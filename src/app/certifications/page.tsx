import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { PageHead } from "@/components/sections/Blocks";
import { ContactBand } from "@/components/sections/ContactBand";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { certs, links } from "@/content/profile";
import { breadcrumbSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";

const TOTAL = certs.reduce((n, c) => n + c.items.length, 0);
const TITLE = `${TOTAL} security certifications and training paths`;
const DESC = `${TOTAL} security certifications held by Shishir Ghimire, including Jr Penetration Tester, CompTIA Pentest+ path, CCEP, CRTDM and log analysis.`;

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/certifications/", image: "/og/certifications.png", keywords: ["Shishir Ghimire certifications", "Jr Penetration Tester", "CCEP", "CRTDM"] });

export default function CertsPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema("/certifications/", TITLE, DESC), breadcrumbSchema([{ name: "Certifications", path: "/certifications/" }]))} />
      <PageHead kicker="Credentials" title={<>{TOTAL} certifications, <span className="text-signal">one habit.</span></>} lead="The paper trail behind the practice: offensive paths, red team foundations and the fundamentals, earned alongside running a company." crumbs={[{ name: "Certifications", path: "/certifications/" }]} />
      <section className="container-x grid gap-5 lg:grid-cols-3">
        {certs.map((c, i) => (
          <Reveal key={c.issuer} delay={i * 0.06} className="rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black p-2">{c.logo ? <Image src={c.logo} alt={`${c.issuer} logo`} width={48} height={48} className="h-full w-full object-contain" /> : <span className="font-mono text-sm font-bold text-data">ICM</span>}</span>
              <div>
                <h2 className="text-xl font-semibold text-fg">{c.issuer}</h2>
                <p className="font-mono text-xs text-subtle">{c.items.length} credentials</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {c.items.map((x) => (
                <li key={x} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-fg/90">
                  <BadgeCheck className="size-4 shrink-0 text-signal" aria-hidden />{x}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>
      <section className="container-x mt-12">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/[0.08] bg-ink-900/40 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted">Verify the TryHackMe paths, badges and the top 1% rank on the public profile.</p>
          <Button href={links.tryhackme} variant="ghost">TryHackMe · N3TANIX</Button>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
