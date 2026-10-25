"use client";

import { useEffect, useRef } from "react";

/**
 * The site-wide background: a slow network of nodes that link up when they
 * drift close, glow around the cursor, and now and then pass a data packet
 * along a link. Runs at 30 fps on phones, pauses in hidden tabs and draws a
 * single still frame for people who prefer reduced motion.
 */
type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { a: number; b: number; t: number; speed: number };

export function Ambient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75);
    const frame = coarse ? 1 / 30 : 1 / 60;
    const LINK = coarse ? 110 : 140;
    let w = 0, h = 0, raf = 0, last = 0, acc = 0;
    let nodes: Node[] = [];
    const packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const count = Math.round(Math.min(coarse ? 40 : 75, (w * h) / (coarse ? 26000 : 19000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.5,
      }));
    };
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const step = dt * 60;
      for (const n of nodes) {
        n.x += n.vx * step; n.y += n.vy * step;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        // gentle pull toward the cursor
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < 180 && d > 1) { n.x += (dx / d) * 0.12 * step; n.y += (dy / d) * 0.12 * step; }
      }
      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          const near = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) / 220);
          const alpha = (1 - d / LINK) * (0.17 + near * 0.45);
          ctx.strokeStyle = near > 0.05 ? `rgba(139,224,78,${alpha.toFixed(3)})` : `rgba(120,170,210,${alpha.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (!reduce && packets.length < 14 && Math.random() < 0.0012) packets.push({ a: i, b: j, t: 0, speed: 0.5 + Math.random() * 0.6 });
        }
      }
      // nodes
      for (const n of nodes) {
        const near = Math.max(0, 1 - Math.hypot(n.x - mouse.x, n.y - mouse.y) / 200);
        ctx.fillStyle = near > 0.05 ? `rgba(178,239,134,${0.45 + near * 0.55})` : "rgba(170,195,220,0.5)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + near * 1.2, 0, Math.PI * 2); ctx.fill();
      }
      // packets travelling along links
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.t += p.speed * dt;
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b || p.t >= 1 || Math.hypot(a.x - b.x, a.y - b.y) > LINK * 1.2) { packets.splice(k, 1); continue; }
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        ctx.fillStyle = "rgba(56,214,255,0.95)";
        ctx.shadowColor = "rgba(56,214,255,0.9)"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05); last = now;
      acc += dt;
      if (!document.hidden && acc >= frame) { draw(acc); acc = 0; }
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      // feed the card spotlight effect
      const card = (e.target as HTMLElement | null)?.closest?.(".spot") as HTMLElement | null;
      if (card) { const r = card.getBoundingClientRect(); card.style.setProperty("--x", `${e.clientX - r.left}px`); card.style.setProperty("--y", `${e.clientY - r.top}px`); }
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(0);
    else {
      // start after the page has loaded so it never competes with the first paint
      const start = () => {
        const go = () => { raf = requestAnimationFrame(loop); };
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(go, { timeout: 3000 }); else setTimeout(go, 1200);
      };
      if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
      if (!coarse) { window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); }
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      {/* drifting colour fields under the network */}
      <div className="aurora absolute -left-[10%] top-[-10%] size-[55vw] rounded-full bg-signal/[0.08] blur-[120px]" />
      <div className="aurora-2 absolute -right-[10%] top-[30%] size-[50vw] rounded-full bg-data/[0.07] blur-[140px]" />
      <div className="aurora absolute bottom-[-20%] left-[30%] size-[45vw] rounded-full bg-signal/[0.05] blur-[140px]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-void)_100%)]" />
    </div>
  );
}
