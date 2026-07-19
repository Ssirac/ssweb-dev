"use client";

// Desktop: 3D spinning logo coin (three in a lazy chunk). Mobile / reduced
// motion / no-WebGL / pre-hydration: the existing flat <Logo>.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const HeroLogoScene = dynamic(
  () => import("./hero-logo-3d-scene").then((m) => m.HeroLogo3DScene),
  { ssr: false },
);

export function HeroLogo3D({ size = 84 }: { size?: number }) {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setWebgl(desktop && !reduce && ok);
  }, []);

  if (!webgl) return <Logo size={size} className="animate-float" />;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <HeroLogoScene />
    </div>
  );
}
