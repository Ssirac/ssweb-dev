"use client";

// Interactive 3D orb block. Desktop + WebGL + motion → the distort orb (lazy).
// Otherwise a soft animated gradient sphere fallback.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Orb3DScene = dynamic(() => import("./orb-3d-scene").then((m) => m.Orb3DScene), {
  ssr: false,
});

export function Orb3D() {
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

  // Purely decorative — no meaningful mobile fallback, so render nothing there.
  if (!webgl) return null;

  return (
    <div className="relative mx-auto my-16 aspect-square w-full max-w-sm px-6">
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(69,80,245,0.30), transparent 65%)" }}
      />
      <Orb3DScene />
    </div>
  );
}
