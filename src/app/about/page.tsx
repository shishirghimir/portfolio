import { PageHead, CrewStrip, Timeline, Toolbox } from "@/components/sections/Blocks";
import { AchievementGrid, FeaturedAchievement } from "@/components/sections/Achievements";
import { ContactBand } from "@/components/sections/ContactBand";
import { Faq, faqSchema } from "@/components/sections/Faq";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { person } from "@/content/profile";
import { faqs } from "@/content/faq";
import { breadcrumbSchema, graph, pageMeta, profilePageSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Shishir Ghimire, cybersecurity student from Nepal",
  description: "Who Shishir Ghimire (NetaNix) is: a cybersecurity student and CTF player from Kathmandu, Black Hat MEA 2026 finalist and founder of NetanixCTF and Netanix Lab.",
  path: "/about/",
  image: "/og/about.png",
  type: "profile",
  keywords: ["about Shishir Ghimire", "who is Shishir Ghimire", "NetaNix", "Softwarica ethical hacking", "Coventry University cybersecurity Nepal"],
});

const PHOTOS = [
  { src: "/photos/nagarkot", alt: "Shishir Ghimire above the Kathmandu valley" },
  { src: "/photos/dusk", alt: "Shishir Ghimire at dusk in Kathmandu" },
  { src: "/photos/kurintar", alt: "Shishir Ghimire on the road in Nepal" },
];

const FACTS = [
  ["Name", person.name],
  ["Known as", "NetaNix · N3TANIX"],
  ["Now", "Student, CTF player, founder"],
  ["Founded", "NetanixCTF, Netanix Lab"],
  ["Degree", person.study.degree],
  ["College", `${person.study.school}, ${person.study.uni}`],
  ["Based", person.location],
  ["Email", person.email],
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(profilePageSchema("/about/", "About Shishir Ghimire"), breadcrumbSchema([{ name: "About", path: "/about/" }]), faqSchema(faqs))} />
      <PageHead kicker="About me" title={<>Late start. <span className="text-signal">No days off.</span></>} lead="A student who found his way into tech later than most, got hooked on breaking things, and has not stopped grinding since." crumbs={[{ name: "About", path: "/about/" }]} />

      <section className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="prose-x max-w-2xl text-[17px]">
          <p>I&apos;m <strong>Shishir Ghimire</strong>. Online, most people know me as <strong>NetaNix</strong>. I didn&apos;t grow up obsessed with computers, and tech was never the plan. Then I opened my first Capture The Flag room. I couldn&apos;t solve it, I couldn&apos;t stop thinking about it, and that was the start of everything.</p>
          <p>Since then it has been one room, one box and one writeup at a time, mostly late at night. That grind adds up. I rank in the global <strong>top 1% on TryHackMe</strong> with 236 rooms behind me, I placed <strong>5th in Nepal at HackAstra 2026</strong>, and our team qualified for the <strong>Black Hat MEA CTF 2026 finals</strong> in Riyadh, the only team made up entirely of players from Nepal to get there.</p>
          <p>I also wanted students here to have somewhere to practise, so in 2024 I built <strong>NetanixCTF</strong>. Today it has 500+ registered players, original challenges I write with the team, and live events like the 24 hour CTF we ran at Softwarica College.</p>
          <p>Breaking things made me better at building them. I founded <strong>Netanix Lab</strong>, where I design and lead the software real businesses depend on, from billing systems in phone shops to the platform that runs an interior design company&apos;s crew. Every one of them gets attacked by us before it goes live.</p>
          <p>Right now I&apos;m studying for a <strong>BSc (Hons) in Ethical Hacking and Cybersecurity</strong> at Softwarica College, awarded by Coventry University, preparing for the Black Hat finals, and working towards CRTP and OSCP.</p>
        </div>
        <Reveal>
          <dl className="spot divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-ink-900/60 font-mono text-sm">
            <div className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.16em] text-signal"><span className="size-2 rounded-full bg-signal" />whoami</div>
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 px-5 py-3.5">
                <dt className="text-subtle">{k}</dt>
                <dd className="break-words text-fg/90">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="container-x mt-20" aria-label="Photos">
        <ul className="grid grid-cols-3 gap-3 sm:gap-5">
          {PHOTOS.map((ph, i) => (
            <Reveal as="li" key={ph.src} delay={i * 0.06} className={i === 1 ? "translate-y-6 sm:translate-y-10" : ""}>
              <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                <picture>
                  <source type="image/avif" srcSet={`${ph.src}-sm.avif`} />
                  <img src={`${ph.src}-sm.webp`} alt={ph.alt} width={640} height={853} loading="lazy" className="aspect-[3/4] h-full w-full object-cover transition-transform duration-1000 hover:scale-105" />
                </picture>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x mt-32">
        <SectionHead index="01" kicker="Achievements" title="The results so far." />
        <div className="mt-12"><FeaturedAchievement /></div>
        <div className="mt-4"><AchievementGrid limit={3} /></div>
      </section>

      <section className="container-x mt-32 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead index="02" kicker="Experience & education" title="The timeline." />
        </div>
        <Timeline />
      </section>

      <section className="container-x mt-32">
        <SectionHead index="03" kicker="Skills" title="What I bring to a team." />
        <div className="mt-12"><Toolbox /></div>
      </section>

      <section className="container-x mt-32">
        <SectionHead index="04" kicker="People I build with" title="Credit where it's due." lead="The team behind the products and client work on this site." />
        <div className="mt-12"><CrewStrip /></div>
      </section>

      <section className="container-x mt-32 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead index="05" kicker="FAQ" title="Questions people ask about me." />
        <Faq items={faqs} />
      </section>
      <ContactBand />
    </>
  );
}
