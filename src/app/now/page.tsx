import { PageHead } from "@/components/sections/Blocks";
import { ContactBand } from "@/components/sections/ContactBand";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { now } from "@/content/profile";
import { breadcrumbSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";

const TITLE = "Now: what Shishir Ghimire is working on";
const DESC = "A living snapshot of current focus: scaling NLab Billing, leading Netanix Lab client work, Black Hat MEA finals prep and a new NetanixCTF season.";

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/now/", image: "/og/now.png" });

export default function NowPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema("/now/", TITLE, DESC), breadcrumbSchema([{ name: "Now", path: "/now/" }]))} />
      <PageHead kicker="Now" title={<>What I&apos;m doing <span className="text-signal">right now.</span></>} lead="A living snapshot of current focus, updated when things change." crumbs={[{ name: "Now", path: "/now/" }]} />
      <section className="container-x">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {now.map((n, i) => (
            <Reveal as="li" key={n.title} delay={(i % 3) * 0.06} className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-ink-900/60 p-7">
              <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-signal"><span>{n.tag}</span><span className="text-subtle">0{i + 1}</span></p>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">{n.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{n.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>
      <ContactBand />
    </>
  );
}
