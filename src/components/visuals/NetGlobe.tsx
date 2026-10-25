"use client";

import { useEffect, useRef } from "react";

/**
 * A rotating globe of points with signal arcs leaving Kathmandu, drawn on a
 * 2D canvas with a hand-rolled 3D projection (no WebGL library to download).
 * Drag to spin it, it pauses off screen, and it draws one still frame for
 * people who prefer reduced motion.
 */
const HUBS: [string, number, number][] = [
  ["Kathmandu", 27.7172, 85.324],
  ["Riyadh", 24.7136, 46.6753],
  ["London", 51.5072, -0.1276],
  ["Singapore", 1.3521, 103.8198],
  ["New York", 40.7128, -74.006],
  ["Sydney", -33.8688, 151.2093],
  ["Tokyo", 35.6762, 139.6503],
  ["Frankfurt", 50.1109, 8.6821],
  ["Bengaluru", 12.9716, 77.5946],
  ["Dubai", 25.2048, 55.2708],
];

type V = [number, number, number];
const toVec = (lat: number, lng: number): V => {
  const phi = ((90 - lat) * Math.PI) / 180, th = ((lng + 180) * Math.PI) / 180;
  return [-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)];
};
const norm = (v: V): V => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

export function NetGlobe({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const css = getComputedStyle(document.documentElement);
    const signal = css.getPropertyValue("--color-signal").trim() || "#8be04e";
    const data = css.getPropertyValue("--color-data").trim() || "#38d6ff";

    // evenly spread points (Fibonacci sphere)
    const N = coarse ? 420 : 760;
    const pts: V[] = [];
    const g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    const hubs = HUBS.map(([, lat, lng]) => toVec(lat, lng));
    const home = hubs[0];
    // arcs from Kathmandu to every hub, each with its own pulse phase
    const arcs = hubs.slice(1).map((to, i) => {
      const path: V[] = [];
      const dot = Math.max(-1, Math.min(1, home[0] * to[0] + home[1] * to[1] + home[2] * to[2]));
      const om = Math.acos(dot), so = Math.sin(om) || 1;
      for (let k = 0; k <= 48; k++) {
        const t = k / 48, a = Math.sin((1 - t) * om) / so, b = Math.sin(t * om) / so;
        const p = norm([home[0] * a + to[0] * b, home[1] * a + to[1] * b, home[2] * a + to[2] * b]);
        const lift = 1 + 0.22 * Math.sin(Math.PI * t) * (om / Math.PI + 0.4);
        path.push([p[0] * lift, p[1] * lift, p[2] * lift]);
      }
      return { path, phase: i / 9, speed: 0.16 + (i % 3) * 0.05 };
    });

    let w = 0, h = 0, raf = 0, visible = true, last = 0;
    let rotY = -1.95, rotX = 0.42, vel = 0.0016, drag = false, lx = 0, ly = 0, time = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (v: V) => {
      const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      const x1 = v[0] * cy + v[2] * sy, z1 = -v[0] * sy + v[2] * cy;
      const y2 = v[1] * cx - z1 * sx, z2 = v[1] * sx + z1 * cx;
      const R = Math.min(w, h) * 0.42, f = 3.2, s = (R * f) / (f - z2);
      return { x: w / 2 + x1 * s, y: h / 2 - y2 * s, z: z2 };
    };

    const draw = (dt: number) => {
      time += dt;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.42;

      // atmosphere
      const glow = ctx.createRadialGradient(w / 2, h / 2, R * 0.7, w / 2, h / 2, R * 1.35);
      glow.addColorStop(0, "rgba(56,214,255,0.08)");
      glow.addColorStop(1, "rgba(56,214,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // points, brighter in front
      for (const p of pts) {
        const q = project(p);
        const a = q.z > 0 ? 0.25 + q.z * 0.6 : 0.05 + (1 + q.z) * 0.08;
        ctx.fillStyle = `rgba(190,214,235,${a.toFixed(3)})`;
        const s = q.z > 0 ? 1.4 : 1;
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      }

      // arcs and travelling packets
      ctx.lineWidth = 1.2;
      for (const arc of arcs) {
        const proj = arc.path.map(project);
        ctx.beginPath();
        proj.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
        const front = proj[24].z > -0.2;
        ctx.strokeStyle = front ? "rgba(139,224,78,0.32)" : "rgba(139,224,78,0.08)";
        ctx.stroke();
        const t = (time * arc.speed + arc.phase) % 1;
        const head = proj[Math.floor(t * 48)];
        if (head && head.z > -0.3) {
          ctx.fillStyle = signal;
          ctx.shadowColor = signal; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // hubs, Kathmandu pulses
      hubs.forEach((hb, i) => {
        const q = project(hb);
        if (q.z < -0.15) return;
        ctx.fillStyle = i === 0 ? signal : data;
        ctx.beginPath(); ctx.arc(q.x, q.y, i === 0 ? 3.4 : 2.2, 0, Math.PI * 2); ctx.fill();
        if (i === 0) {
          const pr = (time * 0.8) % 1;
          ctx.strokeStyle = `rgba(139,224,78,${(1 - pr) * 0.8})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(q.x, q.y, 4 + pr * 18, 0, Math.PI * 2); ctx.stroke();
        }
      });

      // equator ring for depth
      ctx.strokeStyle = "rgba(56,214,255,0.10)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        const q = project([Math.cos(a) * 1.08, 0, Math.sin(a) * 1.08]);
        if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y);
      }
      ctx.stroke();
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05); last = now;
      if (!drag) { rotY += vel * 60 * dt; vel += (0.0016 - vel) * 0.02; }
      if (visible && !document.hidden) draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const down = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      rotY += dx * 0.006; vel = dx * 0.0006;
      rotX = Math.max(-0.2, Math.min(0.9, rotX + dy * 0.004));
    };
    const up = () => { drag = false; };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
    if (reduce) draw(0);
    else {
      raf = requestAnimationFrame(loop);
      if (!coarse) { canvas.addEventListener("pointerdown", down); window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); }
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className ?? "h-full w-full cursor-grab active:cursor-grabbing"} />;
}
