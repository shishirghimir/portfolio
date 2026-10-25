import { cn } from "@/lib/cn";
import { Scramble } from "@/components/motion/Scramble";

/** Numbered section label, a console-style kicker and a heading. */
export function SectionHead({ index, kicker, title, lead, className, id }: { index: string; kicker: string; title: React.ReactNode; lead?: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">
        <span className="text-subtle">{index}</span>
        <span className="h-px w-8 bg-signal/50" />
        <Scramble text={kicker} />
      </p>
      <h2 id={id} className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-fg sm:text-4xl lg:text-5xl">{title}</h2>
      {lead && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{lead}</p>}
    </div>
  );
}
