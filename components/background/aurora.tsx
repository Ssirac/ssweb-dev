"use client";

// Global aurora backdrop. Desktop + motion allowed + WebGL only; the shader
// scene is lazy (ssr:false) so three never ships to mobile or SSR.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AuroraScene = dynamic(
  () => import("./aurora-scene").then((m) => m.AuroraScene),
  { ssr: false },
);

export function Aurora() {
  const [on, setOn] = useState(false);
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
    setOn(desktop && !reduce && ok);
  }, []);

  if (!on) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
      <AuroraScene />
    </div>
  );
}
