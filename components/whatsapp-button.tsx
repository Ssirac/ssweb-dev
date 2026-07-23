"use client";

// Floating contact speed-dial: a "+" FAB that fans out WhatsApp, Instagram,
// TikTok, call and email on press. Click-away (or picking a channel) closes
// it. TikTok appears once PROFILE.socials.tiktok is set.

import { useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Phone, Mail, Plus } from "lucide-react";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type DockItem = {
  icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
  label: string;
  external: boolean;
  accent?: string;
};

export function WhatsAppButton() {
  const { lang } = useLang();
  const az = lang === "az";
  const [open, setOpen] = useState(false);

  const items: DockItem[] = [
    {
      icon: FaWhatsapp,
      href: `https://wa.me/${PROFILE.whatsapp[0].number}`,
      label: az ? "WhatsApp-da yaz" : "WhatsApp",
      external: true,
      accent: "#25D366",
    },
    { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram", external: true },
    ...(PROFILE.socials.tiktok
      ? [{ icon: FaTiktok, href: PROFILE.socials.tiktok, label: "TikTok", external: true }]
      : []),
    { icon: Phone, href: `tel:+${PROFILE.whatsapp[0].number}`, label: az ? "Zəng et" : "Call", external: false },
    { icon: Mail, href: `mailto:${PROFILE.email}`, label: az ? "E-poçt yaz" : "Email me", external: false },
  ];

  return (
    <>
      {/* click-away backdrop */}
      {open && <div className="fixed inset-0 z-[299]" onClick={() => setOpen(false)} aria-hidden />}

      <div className="fixed bottom-5 right-5 z-[300] flex flex-col items-center gap-3">
        <AnimatePresence>
          {open &&
            items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={item.label}
                title={item.label}
                initial={{ opacity: 0, y: 14, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                transition={{
                  delay: (items.length - 1 - i) * 0.04,
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setOpen(false)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full glass-strong text-ink shadow-premium transition-colors hover:text-primary"
                style={item.accent ? { background: item.accent, color: "#fff" } : undefined}
              >
                <item.icon size={19} />
                <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg glass-strong px-3 py-1.5 text-sm text-ink opacity-0 shadow-premium transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </motion.a>
            ))}
        </AnimatePresence>

        {/* the "+" toggle */}
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={az ? "Əlaqə kanalları" : "Contact channels"}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-background shadow-glow transition hover:shadow-glow-lg"
        >
          {/* soft pulse ring, only while closed (a hint to press) */}
          {!open && (
            <span className="absolute inset-0 rounded-full bg-primary/60 motion-safe:animate-ping" />
          )}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            <Plus size={26} />
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
