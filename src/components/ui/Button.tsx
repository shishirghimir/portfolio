import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; className?: string; external?: boolean };

export function Button({ href, children, variant = "primary", className, external }: Props) {
  const ext = external ?? /^https?:|^mailto:/.test(href);
  const cls = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
    variant === "primary"
      ? "bg-signal text-on-signal shadow-[0_0_0_1px_rgb(139_224_78/0.4),0_10px_40px_-10px_rgb(139_224_78/0.6)] hover:bg-signal-300"
      : "border border-white/12 bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.06]",
    className,
  );
  const Icon = ext ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {children}
      <Icon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
    </>
  );
  return ext ? <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}
