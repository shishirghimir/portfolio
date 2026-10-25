import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { person } from "@/content/profile";

/** Closing call to action used at the bottom of most pages. */
export function ContactBand() {
  return (
    <section className="container-x mt-32" aria-labelledby="cta-title">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-signal/20 bg-ink-900 px-7 py-14 text-center sm:px-14 sm:py-20">
        <div aria-hidden className="grid-bg fade-mask absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-signal to-transparent" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Secure channel open</p>
          <h2 id="cta-title" className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">Have a system to build, or one you want broken first?</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted">Security engagements, CTF design, software for your business through Netanix Lab, or a role on your team. I reply within a day.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact/">Contact me</Button>
            <Button href={`mailto:${person.email}`} variant="ghost">{person.email}</Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
