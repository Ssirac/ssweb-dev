"use client";

// CSS-only "liquid" button treatment: the visual of UI Layout's 21st.dev
// liquid button, rebuilt without its cost. The original animates ~98 SVG
// gradient attributes per frame per button; this is one slowly rotating
// blurred conic gradient (transform-only, compositor) under a dark inset.
// Usage: put inside a `group relative overflow-hidden rounded-full` element
// and wrap the label in a `relative z-10` span.

export function LiquidGlow({ dim = false }: { dim?: boolean }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <span
        className={`liquid-spin absolute left-1/2 top-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          dim ? "opacity-40 group-hover:opacity-80" : "opacity-85 group-hover:opacity-100"
        }`}
        style={{
          background:
            "conic-gradient(from 0deg, #4550f5, #6e76ff, #22d3ee, #a855f7, #4550f5, #34d399, #4550f5)",
          filter: "blur(10px)",
        }}
      />
      <span className="absolute inset-[2px] rounded-full bg-[#0a0c18]/80" />
    </span>
  );
}
