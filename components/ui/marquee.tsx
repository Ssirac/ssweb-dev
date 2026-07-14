"use client";

/**
 * Seamless infinite marquee. Items are duplicated so the -50% loop is
 * gapless. Pauses on hover and for reduced-motion users.
 */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-muted"
          >
            {item}
            <span className="text-primary">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
