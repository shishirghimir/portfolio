"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useUI } from "@/store/ui";

// Only downloaded when someone opens them.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });
const Terminal = dynamic(() => import("./Terminal").then((m) => m.Terminal), { ssr: false });

/** Keyboard shortcuts and the two global dialogs: Ctrl/⌘+K search and the ` terminal. */
export function Overlays() {
  const { palette, terminal, openPalette, openTerminal, closeAll } = useUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (palette) closeAll(); else openPalette(); }
      else if (e.key === "`" && !typing) { e.preventDefault(); if (terminal) closeAll(); else openTerminal(); }
      else if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, terminal, openPalette, openTerminal, closeAll]);

  useEffect(() => { document.body.style.overflow = palette || terminal ? "hidden" : ""; }, [palette, terminal]);

  return (
    <AnimatePresence>
      {palette && <CommandPalette key="palette" />}
      {terminal && <Terminal key="terminal" />}
    </AnimatePresence>
  );
}
