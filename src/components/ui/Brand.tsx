import Image from "next/image";
import Link from "next/link";

/** The Netanix mark with Shishir's name, used in the navbar and footer. */
export function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Shishir Ghimire, home">
      <span className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-ink-900 transition-colors group-hover:border-signal/50">
        <Image src="/brand/mark-light.webp" alt="Netanix mark" width={26} height={24} priority className="h-6 w-auto" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-semibold tracking-tight text-fg">Shishir Ghimire</span>
          <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-subtle">CEO · Netanix Lab</span>
        </span>
      )}
    </Link>
  );
}
