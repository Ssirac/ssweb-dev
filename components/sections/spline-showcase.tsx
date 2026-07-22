"use client";

// Interactive Spline 3D showcase (the cursor-following robot), harmonized with
// the site's design language. Desktop + WebGL + motion only — the Spline
// runtime and scene are heavy, so mobile never loads them (lazy chunk).

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { useLang } from "@/lib/i18n";

export function SplineShowcase() {
  const { lang } = useLang();
  const az = lang === "az";
  const [enabled, setEnabled] = useState(false);

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
    setEnabled(desktop && !reduce && ok);
  }, []);

  if (!enabled) return null;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      >
        <Card className="glass glass-accent relative h-[500px] w-full overflow-hidden rounded-3xl border-ink/10 bg-black/[0.94] shadow-premium">
          <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" size={340} />

          <div className="flex h-full">
            {/* left — copy */}
            <div className="relative z-10 flex flex-1 flex-col justify-center p-10 lg:p-14">
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
                {az ? "İNTERAKTİV 3D" : "INTERACTIVE 3D"}
              </span>
              <h2 className="text-gradient mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
                {az ? "İnterfeys canlansın" : "Bring UI to life"}
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-muted">
                {az
                  ? "Diqqəti tutan, yaddaqalan istifadəçi təcrübələri — 3D səhnələr, incə animasiyalar və düşünülmüş detallarla."
                  : "Attention-holding, memorable user experiences — with 3D scenes, subtle motion and considered detail."}
              </p>
            </div>

            {/* right — the cursor-following robot */}
            <div className="relative flex-1">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
