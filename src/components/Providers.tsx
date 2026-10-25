"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { Overlays } from "@/components/overlays/Overlays";

// The light `m` components render first; the animation engine arrives a moment later.
const features = () => import("@/lib/motionFeatures").then((r) => r.default);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">
        {children}
        <Overlays />
      </MotionConfig>
    </LazyMotion>
  );
}
