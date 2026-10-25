import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { links, person, socials } from "@/content/profile";
import { projects } from "@/content/projects";
import { NAV } from "@/content/nav";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06] bg-ink-950">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{person.short}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={`${s.label}: ${s.handle}`} className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-muted transition-colors hover:border-signal/40 hover:text-signal">
                <BrandIcon name={s.key} colored className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/contact/", label: "Contact" }].map((n) => (
              <li key={n.href}><Link href={n.href} className="text-muted transition-colors hover:text-fg">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Selected work</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {projects.filter((p) => p.featured).map((p) => (
              <li key={p.slug}><Link href={`/work/${p.slug}/`} className="text-muted transition-colors hover:text-fg">{p.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Ventures</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href={links.netanixlab} target="_blank" rel="noopener" className="text-muted hover:text-fg">Netanix Lab</a></li>
            <li><a href={links.netanixctf} target="_blank" rel="noopener" className="text-muted hover:text-fg">NetanixCTF</a></li>
            <li><a href={`mailto:${person.email}`} className="text-muted hover:text-fg">{person.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {person.name} · Cybersecurity engineer · Kathmandu</p>
          <p>{person.motto}</p>
        </div>
      </div>
    </footer>
  );
}
