// Animated indigo "aurora-mesh" backdrop — a few soft brand-colored blobs that
// slowly drift (GPU-composited transforms, so it's cheap). Desktop only, so it
// never adds cost on mobile. Pure CSS — no image generation, no WebGL.

export function MeshBackdrop({ className = "" }: { className?: string }) {
  const blob = "absolute rounded-full blur-[70px]";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block ${className}`}
    >
      <span
        className={blob}
        style={{
          width: 560, height: 560, top: "-14%", left: "0%",
          background: "radial-gradient(circle, rgba(69,80,245,0.45), transparent 70%)",
          animation: "mesh-a 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <span
        className={blob}
        style={{
          width: 480, height: 480, top: "18%", right: "-4%",
          background: "radial-gradient(circle, rgba(110,118,255,0.34), transparent 70%)",
          animation: "mesh-b 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <span
        className={blob}
        style={{
          width: 440, height: 440, bottom: "-18%", left: "34%",
          background: "radial-gradient(circle, rgba(139,147,255,0.30), transparent 70%)",
          animation: "mesh-c 23s ease-in-out infinite",
          willChange: "transform",
        }}
      />
    </div>
  );
}
