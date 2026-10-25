"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\[]{}#$%&*+=";

/**
 * Decrypts text into place, like a terminal resolving a value. The real text
 * is rendered on the server, so crawlers and screen readers always get it.
 */
export function Scramble({ text, className, delay = 0, speed = 28 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, timer = 0;
    const run = () => {
      const lag = 6;
      const total = text.length + lag;
      const tick = () => {
        frame++;
        // characters lock in left to right; the rest keep cycling
        setOut(text.split("").map((ch, i) => (ch === " " || i < frame - lag ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(""));
        if (frame < total) timer = window.setTimeout(tick, speed);
        else setOut(text);
      };
      tick();
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); timer = window.setTimeout(run, delay); } });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}
