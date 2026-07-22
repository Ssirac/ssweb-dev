"use client";
import { motion } from "framer-motion";
import { ScrambleText } from "./scramble-text";

// `tag` is optional on purpose: the taste audit caps mono-caps eyebrows at
// ~1 per 3 sections, so most sections pass only title + subtitle.
export function SectionHeader({ tag, title, subtitle }: { tag?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-14 text-center">
      {tag && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-primary"
        >
          {tag}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="mx-auto mt-3 max-w-3xl font-display text-4xl md:text-5xl font-bold tracking-tight text-ink"
      >
        <ScrambleText text={title} />
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
