import Image from "next/image";
import { PageHead } from "@/components/sections/Blocks";
import { AchievementGrid, FeaturedAchievement, TryHackMeBadge } from "@/components/sections/Achievements";
import { ContactBand } from "@/components/sections/ContactBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { JsonLd } from "@/components/JsonLd";
import { absolute, achievements } from "@/content/profile";
import { PERSON_ID, breadcrumbSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";

const TITLE = "Achievements: Black Hat MEA 2026 finalist";
const DESC = "Shishir Ghimire's achievements: Black Hat MEA CTF 2026 finalist, 5th at HackAstra 2026, TryHackMe top 1% worldwide and founder of NetanixCTF.";

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/achievements/", image: "/og/achievements.png", keywords: ["Shishir Ghimire achievements", "Black Hat MEA 2026 Nepal", "HackAstra 2026", "TryHackMe top 1% Nepal", "CTF Nepal"] });

const MILESTONES = [
  ["2022", "Started +2 Computer Science at NIST, and my first CTF rooms"],
  ["2024", "Founded NetanixCTF and started a BSc in Ethical Hacking at Softwarica"],
  ["2024", "Organised the Softwarica 24 Hour CTF: 17 teams, one very long night"],
  ["2025", "First production systems for clients: IOS Nepal, BM Mobile Zone and Bhumiraj"],
  ["2025", "Earned 13 certifications across TryHackMe, Red Team Leaders and ICM Security"],
  ["2026", "Registered Netanix Lab as a company; OMH Nepal reached #1 on Google"],
  ["2026", "5th place nationally at HackAstra 2026"],
  ["2026", "Qualified for the Black Hat MEA CTF finals in Riyadh, the only all-Nepali team"],
];

const PHOTOS = [
  { src: "/work/softwarica-group.webp", alt: "Players and organisers at the Softwarica 24 hour CTF run on NetanixCTF" },
  { src: "/work/softwarica-champions.webp", alt: "Prize giving at the Softwarica 24 hour CTF" },
  { src: "/work/softwarica-poster.webp", alt: "Softwarica 24 hour CTF event poster" },
];

export default function AchievementsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema("/achievements/", TITLE, DESC, "CollectionPage"),
          breadcrumbSchema([{ name: "Achievements", path: "/achievements/" }]),
          {
            "@type": "ItemList",
            name: "Achievements of Shishir Ghimire",
            itemListElement: achievements.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "CreativeWork", name: `${a.title}: ${a.result}`, description: a.summary, about: { "@id": PERSON_ID }, url: absolute("/achievements/") } })),
          },
        )}
      />
      <PageHead kicker="Achievements" title={<>Proof, not <span className="text-signal">promises.</span></>} lead="International finals, national rankings and the community I built along the way. Every result here is something you can check." crumbs={[{ name: "Achievements", path: "/achievements/" }]} />

      <section className="container-x">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] lg:grid-cols-4">
          {[
            { to: 1, prefix: "", suffix: "", label: "International CTF final", extra: "Black Hat MEA 2026" },
            { to: 5, prefix: "#", suffix: "", label: "In Nepal at HackAstra", extra: "2026" },
            { to: 1, prefix: "Top ", suffix: "%", label: "TryHackMe worldwide", extra: "Rank #6,756" },
            { to: 500, prefix: "", suffix: "+", label: "Players on NetanixCTF", extra: "Since 2024" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-void/90 p-6 sm:p-8">
              <dt className="mt-2 text-sm text-muted">{s.label}<span className="mt-1 block font-mono text-[11px] text-signal-300">{s.extra}</span></dt>
              <dd className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl"><Counter to={s.to} prefix={s.prefix} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x mt-16"><FeaturedAchievement /></section>
      <section className="container-x mt-4"><AchievementGrid /></section>

      <section className="container-x mt-24 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <SectionHead index="01" kicker="On the ground" title="Running the Softwarica 24 Hour CTF." lead="17 teams, a full day and night of challenges on NetanixCTF, and prizes for the top three. Organising it taught me as much as competing does." />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PHOTOS.map((p, i) => (
              <Reveal as="li" key={p.src} delay={i * 0.06} className={i === 0 ? "col-span-2 sm:col-span-1" : ""}>
                <div className="spot overflow-hidden rounded-2xl border border-white/[0.08]">
                  <span className="relative block aspect-[4/3]"><Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 30vw, 50vw" className="object-cover transition-transform duration-1000 hover:scale-105" /></span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="lg:pt-24"><TryHackMeBadge /></div>
      </section>

      <section className="container-x mt-24">
        <SectionHead index="02" kicker="Milestones" title="How it added up." />
        <ol className="mt-10 grid gap-3 md:grid-cols-2">
          {MILESTONES.map(([y, t], i) => (
            <Reveal as="li" key={t} delay={(i % 2) * 0.05} className="spot flex items-start gap-5 rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
              <span className="font-mono text-sm font-semibold text-signal">{y}</span>
              <span className="text-[15px] leading-relaxed text-fg/90">{t}</span>
            </Reveal>
          ))}
        </ol>
      </section>
      <ContactBand />
    </>
  );
}
