"use client";

import { m, type HTMLMotionProps } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade and rise into view once. The content is always in the HTML for crawlers. */
export function Reveal({ children, delay = 0, y = 22, as = "div", ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" }) {
  const C = (as === "li" ? m.li : m.div) as typeof m.div;
  return (
    <C initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease, delay }} {...rest}>
      {children}
    </C>
  );
}
