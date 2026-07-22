"use client";

// CSS-only spinning logo coin. Replaces the three.js HeroLogo3D: that was a
// second WebGL context running alongside the Spline robot in the hero.
// Pure transform animation → compositor-only, zero paint, zero JS per frame.

export function LogoCoin({ size = 84 }: { size?: number }) {
  return (
    <div aria-hidden style={{ width: size, height: size, perspective: 600 }}>
      <div
        className="relative h-full w-full motion-reduce:[animation:none]"
        style={{ transformStyle: "preserve-3d", animation: "coin-spin 7s linear infinite" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sslogo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full rounded-full object-cover shadow-glow ring-1 ring-primary/40"
          style={{ backfaceVisibility: "hidden" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sslogo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full rounded-full object-cover shadow-glow ring-1 ring-primary/40"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        />
      </div>
    </div>
  );
}
