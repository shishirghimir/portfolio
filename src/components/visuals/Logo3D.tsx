"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Mesh } from "three";

/**
 * The Netanix mark as a real 3D object (three.js): the traced logo is extruded
 * with a bevel and lit by a studio environment. Green parts are glossy brand
 * green, dark parts brushed silver. It floats, leans toward the cursor and
 * flips a full 360 top over bottom on hover or click. three.js loads after
 * the page, and a flat logo shows until it is ready.
 */
export function Logo3D({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const data: { width: number; height: number; green: string; dark: string } = await (await fetch("/brand/mark-paths.json")).json();
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      el.appendChild(renderer.domElement);
      renderer.domElement.className = "absolute inset-0 h-full w-full";

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 9.5);

      // lights: key, cool fill and a green rim from behind
      const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 6); scene.add(key);
      const fill = new THREE.DirectionalLight(0xbfd4ff, 0.6); fill.position.set(-5, -1, 3); scene.add(fill);
      const rim = new THREE.PointLight(0x7cc242, 40, 20); rim.position.set(-2.5, 2, -3); scene.add(rim);

      // geometry from the traced paths
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${data.width} ${data.height}"><path id="g" d="${data.green}"/><path id="d" d="${data.dark}"/></svg>`;
      const parsed = new SVGLoader().parse(svg);
      const greenMat = new THREE.MeshPhysicalMaterial({ color: 0x7cc242, metalness: 0.25, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
      const darkMat = new THREE.MeshPhysicalMaterial({ color: 0xc8cdd2, metalness: 1, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 });
      const extrude = { depth: 110, bevelEnabled: true, bevelThickness: 14, bevelSize: 9, bevelSegments: 5, curveSegments: 24 };

      const logo = new THREE.Group();
      parsed.paths.forEach((p, i) => {
        const mat = i === 0 ? greenMat : darkMat;
        for (const shape of SVGLoader.createShapes(p)) {
          const geo = new THREE.ExtrudeGeometry(shape, extrude);
          logo.add(new THREE.Mesh(geo, mat));
        }
      });
      // centre, flip SVG's y-down space and scale to ~3.4 world units wide
      const box = new THREE.Box3().setFromObject(logo);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      logo.children.forEach((m) => (m as Mesh).geometry.translate(-center.x, -center.y, -center.z));
      const s = 3.4 / Math.max(size.x, size.y);
      logo.scale.set(s, -s, s);
      const pivot = new THREE.Group();
      pivot.add(logo);
      scene.add(pivot);

      const resize = () => {
        const r = el.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / Math.max(1, r.height);
        camera.updateProjectionMatrix();
      };
      resize();

      // interaction
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      let flip = 0; // radians still to turn around X
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const spin = () => { if (flip < 0.1) flip = Math.PI * 2; };
      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerenter", spin);
      el.addEventListener("click", spin);

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(el);
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const clock = new THREE.Clock();
      let intro = 0, raf = 0, flipAngle = 0;
      const render = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        intro = Math.min(1, intro + dt / 1.6);
        const ease = 1 - Math.pow(1 - intro, 3);
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        if (flip > 0) { const step = Math.max(dt * 7 * Math.min(1, flip), 0.002); flipAngle += Math.min(step, flip); flip -= Math.min(step, flip); }
        pivot.rotation.y = (1 - ease) * -1.1 + Math.sin(t * 0.45) * 0.32 + mouse.x * 0.35;
        pivot.rotation.x = flipAngle + mouse.y * 0.18 + Math.sin(t * 0.33) * 0.05;
        pivot.position.y = Math.sin(t * 0.9) * 0.08;
        pivot.scale.setScalar(0.82 + ease * 0.18);
        rim.position.x = -2.5 + Math.sin(t * 0.5) * 1.2;
        renderer.render(scene, camera);
      };
      const loop = () => { if (visible && !document.hidden) render(); raf = requestAnimationFrame(loop); };
      if (reduce) { intro = 1; render(); } else raf = requestAnimationFrame(loop);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerenter", spin); el.removeEventListener("click", spin);
        logo.traverse((o) => { if ((o as Mesh).geometry) (o as Mesh).geometry.dispose(); });
        greenMat.dispose(); darkMat.dispose(); pmrem.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // three.js is heavy, so it only loads once the page has finished loading,
    // the browser is idle and the logo is on screen. The flat logo shows until then.
    let started = false;
    const idle = (fn: () => void) => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 800));
    const kick = () => {
      if (started || disposed) return;
      started = true;
      watch.disconnect();
      idle(() => { if (!disposed) void start(); });
    };
    const whenLoaded = () => (document.readyState === "complete" ? kick() : window.addEventListener("load", kick, { once: true }));
    const watch = new IntersectionObserver(([e]) => { if (e.isIntersecting) whenLoaded(); }, { rootMargin: "150px" });
    watch.observe(el);

    return () => { disposed = true; watch.disconnect(); window.removeEventListener("load", kick); cleanup(); };
  }, []);

  return (
    <div ref={wrap} className={cn("relative cursor-pointer", className)} aria-hidden>
      {/* flat logo until the 3D scene is ready */}
      <Image src="/brand/mark-light.webp" alt="" fill sizes="(min-width: 1024px) 30vw, 60vw" className={cn("object-contain p-[18%] transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")} />
    </div>
  );
}
