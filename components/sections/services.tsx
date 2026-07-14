"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/section-header";
import { GlowCard } from "../ui/glow-card";
import { SERVICES } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.services.tag} title={t.services.title} subtitle={t.services.subtitle} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <GlowCard className="h-full">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:scale-110 group-hover:shadow-glow">
                <s.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-ink">{t.services.items[s.key].title}</h3>
              <p className="mt-2 text-sm text-muted">{t.services.items[s.key].desc}</p>
              <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
