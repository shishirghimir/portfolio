import Link from "next/link";
import { cn } from "@/lib/cn";

/** Shishir's personal SG mark: a shield hexagon with the initials. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path d="M24 3.5 41.8 13.75v20.5L24 44.5 6.2 34.25v-20.5L24 3.5Z" stroke="var(--color-signal)" strokeWidth="2.6" strokeLinejoin="round" />
      <text x="24" y="30.6" textAnchor="middle" fontSize="17" fontWeight="800" letterSpacing="-0.8" style={{ fontFamily: "var(--font-geist), Segoe UI, Arial, sans-serif" }}>
        <tspan fill="var(--color-fg)">S</tspan>
        <tspan fill="var(--color-signal)">G</tspan>
      </text>
    </svg>
  );
}

/** The SG mark with Shishir's name, used in the navbar and footer. */
export function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Shishir Ghimire, home">
      <BrandMark className={cn("size-10 transition-transform duration-500 group-hover:scale-110")} />
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-semibold tracking-tight text-fg">Shishir Ghimire</span>
          <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-subtle">Security engineer</span>
        </span>
      )}
    </Link>
  );
}
