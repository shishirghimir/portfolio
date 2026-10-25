"use client";

import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { person } from "@/content/profile";

/** Shishir's portrait framed as an operator ID, tilting gently toward the cursor. */
export function IdCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 }), sy = useSpring(my, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className="[perspective:1200px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <m.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        <div className="brackets relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-ink-900 p-2 shadow-[0_50px_120px_-30px_rgb(0_0_0/0.95)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] scanlines">
            <picture>
              <source type="image/avif" srcSet="/photos/dusk-sm.avif 640w, /photos/dusk.avif 960w" sizes="(min-width: 1024px) 420px, 80vw" />
              <img
                src="/photos/dusk.webp"
                srcSet="/photos/dusk-sm.webp 640w, /photos/dusk.webp 960w"
                sizes="(min-width: 1024px) 420px, 80vw"
                alt={`${person.name}, Founder & CEO of Netanix Lab, in Kathmandu`}
                width={960}
                height={1280}
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_20%]"
              />
            </picture>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
            {/* scanning beam */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-transparent via-signal/25 to-transparent" />
            {/* face lock */}
            <div aria-hidden className="absolute left-[30%] top-[16%] h-[30%] w-[40%]">
              <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-signal" />
              <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-signal" />
              <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-signal" />
              <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-signal" />
              <span className="absolute -top-6 left-0 rounded bg-signal px-1.5 py-0.5 font-mono text-[9px] font-semibold text-on-signal">MATCH 99.2%</span>
            </div>
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-fg/80">
              <span>ID · NX-0001</span>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-signal" />Verified</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-xl font-semibold text-fg">{person.name}</p>
              <p className="mt-0.5 text-sm text-signal-300">Founder & CEO · Netanix Lab</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.12em]">
                <div><dt className="text-subtle">Alias</dt><dd className="mt-0.5 text-fg">{person.alias}</dd></div>
                <div><dt className="text-subtle">Access</dt><dd className="mt-0.5 text-fg">Root</dd></div>
                <div><dt className="text-subtle">Base</dt><dd className="mt-0.5 text-fg">KTM · NP</dd></div>
              </dl>
            </div>
          </div>
          {!reduce && <m.div aria-hidden style={{ left: glareX }} className="pointer-events-none absolute -top-1/2 h-[200%] w-1/3 -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />}
        </div>
      </m.div>
    </div>
  );
}
