"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Command, Menu, SquareTerminal, X } from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { socials } from "@/content/profile";
import { NAV } from "@/content/nav";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/cn";

export function Navbar() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { menu, toggleMenu, openPalette, openTerminal } = useUI();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { toggleMenu(false); }, [path, toggleMenu]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled || menu ? "border-b border-white/[0.06] bg-void/80 backdrop-blur-xl" : "border-b border-transparent")}>
      <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Brand />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined} className={cn("relative isolate rounded-full px-4 py-2 text-sm transition-colors", active ? "text-fg" : "text-muted hover:text-fg")}>
                  {active && <m.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.05]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" onClick={openPalette} aria-label="Search the site" className="hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 font-mono text-xs text-subtle transition-colors hover:border-white/20 hover:text-fg sm:flex">
            <Command className="size-3.5" aria-hidden />K
          </button>
          <button type="button" onClick={openTerminal} aria-label="Open the terminal" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-signal/40 hover:text-signal">
            <SquareTerminal className="size-4" aria-hidden />
          </button>
          <Link href="/contact/" className="hidden rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-on-signal transition-colors hover:bg-signal-300 sm:inline-flex">
            Contact
          </Link>
          <button type="button" onClick={() => toggleMenu()} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} className="grid size-10 place-items-center rounded-full border border-white/10 text-fg lg:hidden">
            {menu ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menu && (
          <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-white/[0.06] lg:hidden">
            <div className="container-x py-6">
              <ul className="grid gap-1">
                {[...NAV, { href: "/contact/", label: "Contact" }].map((n, i) => (
                  <m.li key={n.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <Link href={n.href} className="flex items-center justify-between rounded-xl px-3 py-3 text-lg text-fg hover:bg-white/[0.04]">
                      {n.label}<span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2 border-t border-white/[0.06] pt-6">
                {socials.map((s) => (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-11 place-items-center rounded-xl border border-white/10 text-muted hover:text-fg">
                    <BrandIcon name={s.key} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
