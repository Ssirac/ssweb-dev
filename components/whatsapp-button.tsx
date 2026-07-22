"use client";

// Floating contact dock: Instagram / call / TikTok / mail stacked above the
// WhatsApp button, bottom-right on every page. TikTok appears once
// PROFILE.socials.tiktok is filled in.

import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Phone, Mail } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function WhatsAppButton() {
  const { lang } = useLang();
  const az = lang === "az";
  const waHref = `https://wa.me/${PROFILE.whatsapp[0].number}`;
  const waLabel = az ? "WhatsApp-da yaz" : "Message on WhatsApp";

  const items = [
    { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram", external: true },
    { icon: Phone, href: `tel:+${PROFILE.whatsapp[0].number}`, label: az ? "Zəng et" : "Call", external: false },
    ...(PROFILE.socials.tiktok
      ? [{ icon: FaTiktok, href: PROFILE.socials.tiktok, label: "TikTok", external: true }]
      : []),
    { icon: Mail, href: `mailto:${PROFILE.email}`, label: az ? "E-poçt yaz" : "Email me", external: false },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[300] flex flex-col items-center gap-3">
      {items.map((item, i) => (
        <motion.a
          key={item.label}
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={item.label}
          title={item.label}
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.15 + i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full glass-strong text-ink shadow-premium transition-colors hover:text-primary"
        >
          <item.icon size={18} />
          <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg glass-strong px-3 py-1.5 text-sm text-ink opacity-0 shadow-premium transition-opacity duration-200 group-hover:opacity-100">
            {item.label}
          </span>
        </motion.a>
      ))}

      <motion.a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={waLabel}
        title={waLabel}
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)]"
        style={{ background: "#25D366" }}
      >
        {/* soft pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping" />
        <FaWhatsapp size={28} className="relative z-10" />
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg glass-strong px-3 py-1.5 text-sm text-ink opacity-0 shadow-premium transition-opacity duration-200 group-hover:opacity-100">
          {waLabel}
        </span>
      </motion.a>
    </div>
  );
}
