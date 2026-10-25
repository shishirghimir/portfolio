import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { PageHead } from "@/components/sections/Blocks";
import { ContactForm } from "@/components/sections/ContactForm";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { links, person, socials } from "@/content/profile";
import { breadcrumbSchema, graph, pageMeta, webPageSchema } from "@/lib/seo";

const TITLE = "Contact Shishir Ghimire, Founder of Netanix Lab";
const DESC = "Reach Shishir Ghimire, founder and CEO of Netanix Lab, for software projects, security assessments, CTF collaborations or roles. Email, LinkedIn, GitHub and more.";

export const metadata = pageMeta({ title: TITLE, description: DESC, path: "/contact/", image: "/og/contact.png" });

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema("/contact/", TITLE, DESC, "ContactPage"), breadcrumbSchema([{ name: "Contact", path: "/contact/" }]))} />
      <PageHead kicker="Contact" title={<>Open a <span className="text-signal">secure channel.</span></>} lead="Software for your business through Netanix Lab, a security assessment, a CTF collaboration or a role on your team. I usually reply within a day." crumbs={[{ name: "Contact", path: "/contact/" }]} />
      <section className="container-x grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          <a href={`mailto:${person.email}`} className="group flex items-center gap-4 rounded-2xl border border-signal/25 bg-signal/[0.05] p-5 transition-colors hover:border-signal/50">
            <span className="grid size-12 place-items-center rounded-xl bg-signal text-on-signal"><Mail className="size-5" aria-hidden /></span>
            <span className="min-w-0 flex-1"><span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-signal">Email · fastest</span><span className="mt-0.5 block truncate text-fg">{person.email}</span></span>
            <ArrowUpRight className="size-4 text-signal" aria-hidden />
          </a>
          {socials.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.04}>
              <a href={s.href} target="_blank" rel="noopener noreferrer me" className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5 transition-colors hover:border-white/20">
                <span className="grid size-12 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-fg"><BrandIcon name={s.key} className="size-5" /></span>
                <span className="min-w-0 flex-1"><span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{s.label}</span><span className="mt-0.5 block truncate text-fg">{s.handle}</span></span>
                <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-signal" aria-hidden />
              </a>
            </Reveal>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-ink-900/60 p-5">
            <span className="grid size-12 place-items-center rounded-xl border border-white/10 text-fg"><MapPin className="size-5" aria-hidden /></span>
            <span><span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Based in</span><span className="mt-0.5 block text-fg">{person.location}</span></span>
          </div>
          <p className="px-1 pt-2 text-sm text-muted">Need a team for a software project? <a href={links.netanixlab} target="_blank" rel="noopener" className="text-signal hover:text-signal-300">Netanix Lab</a> handles quotes and delivery.</p>
        </div>
        <Reveal className="rounded-[1.8rem] border border-white/[0.08] bg-ink-900/70 p-6 sm:p-9">
          <h2 className="text-2xl font-semibold tracking-tight text-fg">Send a message</h2>
          <p className="mt-2 text-sm text-muted">Tell me what you need and I will get back to you with next steps.</p>
          <div className="mt-8"><ContactForm /></div>
        </Reveal>
      </section>
    </>
  );
}
