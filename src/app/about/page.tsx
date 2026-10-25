import { PageHead, CrewStrip, SkillsMatrix, Timeline } from "@/components/sections/Blocks";
import { ContactBand } from "@/components/sections/ContactBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { person } from "@/content/profile";
import { breadcrumbSchema, graph, pageMeta, profilePageSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Shishir Ghimire, Founder & CEO of Netanix Lab",
  description: "Shishir Ghimire (NetaNix): founder and CEO of Netanix Lab, founder of NetanixCTF, Black Hat MEA 2026 finalist and ethical hacking student in Kathmandu.",
  path: "/about/",
  image: "/og/about.png",
  type: "profile",
  keywords: ["about Shishir Ghimire", "NetaNix", "Netanix Lab founder", "Softwarica ethical hacking"],
});

const PHOTOS = [
  { src: "/photos/nagarkot", alt: "Shishir Ghimire above the Kathmandu valley", w: 900, h: 1200 },
  { src: "/photos/dusk", alt: "Shishir Ghimire at dusk in Kathmandu", w: 960, h: 1280 },
  { src: "/photos/kurintar", alt: "Shishir Ghimire on the road in Nepal", w: 960, h: 1280 },
];

const FACTS = [
  ["Name", person.name],
  ["Alias", "NetaNix · N3TANIX"],
  ["Role", "Founder & CEO, Netanix Lab"],
  ["Also", "Founder, NetanixCTF"],
  ["Degree", person.study.degree],
  ["College", `${person.study.school}, ${person.study.uni}`],
  ["Based", person.location],
  ["Email", person.email],
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(profilePageSchema("/about/", "About Shishir Ghimire"), breadcrumbSchema([{ name: "About", path: "/about/" }]))} />
      <PageHead kicker="About" title={<>Building companies, <span className="text-signal">breaking systems.</span></>} lead="Founder and CEO of Netanix Lab, founder of NetanixCTF, and a security engineer who would rather prove a system is safe than assume it." crumbs={[{ name: "About", path: "/about/" }]} />

      <section className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="prose-x max-w-2xl text-[17px]">
          <p>I&apos;m <strong>Shishir Ghimire</strong>, known online as <strong>NetaNix</strong>. I grew up in Kathmandu taking software apart to see how it worked, and I never really stopped. Security came first: CTF rooms, boxes and writeups, until I wanted a place where students in Nepal could compete and learn together. So in 2024 I built one, <strong>NetanixCTF</strong>, which now has 500+ registered players.</p>
          <p>Running that platform taught me how to ship software that has to survive real users and real attackers. Local businesses started asking us to build for them, and that became <strong>Netanix Lab</strong>, the registered software company I lead as founder and CEO. Our team of eight builds billing and POS systems for retail shops, a workforce platform for an interior design company, websites that rank, and our own cloud product, <strong>NLab Billing</strong>.</p>
          <p>My job is to set the direction, win and lead the client work, and architect what we ship. I still write a lot of the code, and I still try to break all of it before it goes live. That habit is why security is built into everything Netanix Lab delivers, not added at the end.</p>
          <p>I compete when I can: our team qualified for the <strong>Black Hat MEA 2026</strong> CTF finals in Riyadh, the only all-Nepali team to do so, and we placed 5th at HackAstra 2026. I&apos;m in the global top 1% on TryHackMe as <strong>N3TANIX</strong>, and I&apos;m studying for a BSc (Hons) in Ethical Hacking and Cybersecurity at Softwarica College, awarded by Coventry University.</p>
        </div>
        <Reveal>
          <dl className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-ink-900/60 font-mono text-sm">
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

      <section className="container-x mt-32 grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead index="01" kicker="Experience & education" title="The timeline." />
        </div>
        <Timeline />
      </section>

      <section className="container-x mt-32">
        <SectionHead index="02" kicker="Capabilities" title="What I bring to a team." />
        <div className="mt-12"><SkillsMatrix /></div>
      </section>

      <section className="container-x mt-32">
        <SectionHead index="03" kicker="The crew" title="The people I build with." lead="Netanix Lab is a team effort. These are the people behind the work on this site." />
        <div className="mt-12"><CrewStrip /></div>
      </section>
      <ContactBand />
    </>
  );
}
