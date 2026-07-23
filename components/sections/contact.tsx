"use client";

// Contact section, form-free: direct channels only (email, WhatsApp, socials).
// Messaging happens through the floating dock / links, so the EmailJS form
// was removed on request.

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { SectionHeader } from "../ui/section-header";
import { Magnetic } from "../ui/magnetic";
import { AvailabilityBadge } from "../ui/availability-badge";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const SOCIALS = [
  { icon: FaWhatsapp, href: `https://wa.me/${PROFILE.whatsapp[0].number}`, label: "WhatsApp" },
  { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram" },
  { icon: FaTiktok, href: PROFILE.socials.tiktok, label: "TikTok" },
  { icon: FaGithub, href: PROFILE.socials.github, label: "GitHub" },
  { icon: FaLinkedin, href: PROFILE.socials.linkedin, label: "LinkedIn" },
];

export function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="section-anchor relative mx-auto max-w-4xl px-6 py-28">
      <SectionHeader tag={t.contact.tag} title={t.contact.title} subtitle={t.contact.subtitle} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-xl rounded-3xl glass p-8 shadow-premium"
      >
        <h3 className="text-xl font-semibold text-ink">{t.contact.getInTouch}</h3>

        <a
          href={`mailto:${PROFILE.email}`}
          className="mt-3 block text-sm text-muted transition hover:text-primary"
        >
          {PROFILE.email}
        </a>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
          <FaWhatsapp size={15} /> WhatsApp
        </div>
        {PROFILE.whatsapp.map((w) => (
          <a
            key={w.number}
            href={`https://wa.me/${w.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 block font-mono text-sm text-muted transition hover:text-primary"
          >
            {w.display}
          </a>
        ))}

        <p className="mt-5 text-sm text-muted">{t.contact.availability}</p>
        <div className="mt-4">
          <AvailabilityBadge />
        </div>

        <div className="mt-8 flex gap-3">
          {SOCIALS.map((s) => (
            <Magnetic key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor
                className="flex h-11 w-11 items-center justify-center rounded-xl glass text-muted transition hover:border-primary/40 hover:text-primary hover:shadow-glow"
              >
                <s.icon size={18} />
              </a>
            </Magnetic>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
