import { NetGlobe } from "@/components/visuals/NetGlobe";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { person, roles, socials } from "@/content/profile";
import { IdCard } from "./IdCard";
import { RoleTyper } from "./RoleTyper";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:min-h-[100svh] lg:pb-20 lg:pt-36">
      {/* backdrop: grid, glows and the globe */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg fade-mask absolute inset-0 opacity-60" />
        <div className="absolute -left-40 top-20 size-[520px] rounded-full bg-signal/[0.07] blur-[120px]" />
        <div className="absolute -right-20 top-40 size-[560px] rounded-full bg-data/[0.07] blur-[140px]" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <p data-rise className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-signal/70" /><span className="relative inline-flex size-2 rounded-full bg-signal" /></span>
            Online · Kathmandu 27.71°N 85.32°E
          </p>

          {/* painted once, straight from the HTML (it is the largest element on the page); the glitch runs on hover */}
          <h1 className="mt-7 text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.05em] text-fg sm:text-7xl lg:text-[6.4rem]">
            <span className="glitch block" data-text="Shishir">Shishir</span>
            <span className="glitch glow block text-signal" data-text="Ghimire">Ghimire</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl" data-rise style={{ animationDelay: "0.18s" }}>
            <span className="sr-only">{person.headline}. </span>
            <RoleTyper roles={roles} />
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" data-rise style={{ animationDelay: "0.26s" }}>
            I&apos;m a cybersecurity engineer from Kathmandu. I find the holes attackers would use, write Capture The Flag challenges for Nepal&apos;s security community and compete on the world stage, most recently as a <span className="text-fg">Black Hat MEA 2026 finalist</span>. I also founded <a href="https://netanixlab.com" target="_blank" rel="noopener" className="text-fg underline decoration-signal/50 underline-offset-4 hover:decoration-signal">Netanix Lab</a>, where I build secure software for businesses across Nepal.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-rise style={{ animationDelay: "0.34s" }}>
            <Button href="/work/">Explore my work</Button>
            <Button href="/achievements/" variant="ghost">See my achievements</Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-2" data-rise style={{ animationDelay: "0.42s" }} aria-label="Profiles">
            {socials.map((s) => (
              <li key={s.key}>
                <a href={s.href} target="_blank" rel="noopener noreferrer me" className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-2 pl-2.5 pr-3.5 text-xs text-muted transition-colors hover:border-signal/40 hover:text-fg">
                  <BrandIcon name={s.key} colored className="size-3.5" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none" data-rise style={{ animationDelay: "0.2s" }}>
          <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-90 sm:w-[135%]">
            <NetGlobe />
          </div>
          <div className="mx-auto w-[82%] max-w-[400px] animate-float">
            <IdCard />
          </div>
        </div>
      </div>
    </section>
  );
}
