"use client";

// Animated radar/spider chart of the skill levels — replaces the progress bars.
// Pure SVG; the data polygon scales in when it enters the viewport.

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/data";

const CX = 220;
const CY = 220;
const R = 140;

export function SkillRadar() {
  const N = SKILLS.length;
  const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [
    CX + r * Math.cos(angle(i)),
    CY + r * Math.sin(angle(i)),
  ];
  const ringPoints = (f: number) => SKILLS.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const dataPoints = SKILLS.map((s, i) => pt(i, (s.level / 100) * R).join(",")).join(" ");

  return (
    <div className="mx-auto w-full max-w-md">
      <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label={SKILLS.map((s) => `${s.name} ${s.level}%`).join(", ")}>
        {/* grid rings */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f} points={ringPoints(f)} fill="none" className="stroke-ink/10" strokeWidth="1" />
        ))}
        {/* axes */}
        {SKILLS.map((_, i) => {
          const [x, y] = pt(i, R);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} className="stroke-ink/10" strokeWidth="1" />;
        })}
        {/* data polygon */}
        <motion.polygon
          points={dataPoints}
          className="fill-primary/20 stroke-primary"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.55 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        {/* vertex dots */}
        {SKILLS.map((s, i) => {
          const [x, y] = pt(i, (s.level / 100) * R);
          return <circle key={i} cx={x} cy={y} r="3.5" className="fill-primary" />;
        })}
        {/* labels + values */}
        {SKILLS.map((s, i) => {
          const [x, y] = pt(i, R + 30);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted"
              fontSize="12"
              fontFamily="var(--font-mono)"
            >
              {s.name} · {s.level}%
            </text>
          );
        })}
      </svg>
    </div>
  );
}
