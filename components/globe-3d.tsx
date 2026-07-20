"use client";

// Interactive globe block. Desktop + WebGL + motion → the wireframe globe
// (lazy chunk). Otherwise a soft gradient-sphere fallback.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobeScene = dynamic(() => import("./globe-3d-scene").then((m) => m.GlobeScene), {
  ssr: false,
});

export function Globe3D() {
  const [webgl, setWebgl] = useState(false);
  const [hint, setHint] = useState(true);

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
    const timer = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto h-[520px] w-full max-w-4xl overflow-hidden rounded-3xl">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(58,134,255,0.12), transparent 70%)" }}
      />
      {webgl ? (
        <GlobeScene />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-float h-56 w-56 rounded-full bg-brand-gradient opacity-70 blur-[2px]" />
        </div>
      )}
      {webgl && hint && (
        <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/30 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
          Drag to explore
        </div>
      )}
    </div>
  );
}
