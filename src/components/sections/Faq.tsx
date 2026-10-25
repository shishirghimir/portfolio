import { Plus } from "lucide-react";

/** Accessible accordion built on <details>, so the answers are always in the HTML. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/60">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-medium text-fg transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 transition-transform duration-300 group-open:rotate-45 group-open:border-signal/40 group-open:text-signal"><Plus className="size-4" aria-hidden /></span>
          </summary>
          <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
