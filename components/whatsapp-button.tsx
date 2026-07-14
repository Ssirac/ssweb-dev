"use client";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

export function WhatsAppButton() {
  const { lang } = useLang();
  const href = `https://wa.me/${PROFILE.whatsapp[0].number}`;
  const label = lang === "az" ? "WhatsApp-da yaz" : "Message on WhatsApp";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-5 right-5 z-[300] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)]"
      style={{ background: "#25D366" }}
    >
      {/* soft pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping" />
      <FaWhatsapp size={28} className="relative z-10" />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg glass-strong px-3 py-1.5 text-sm text-ink opacity-0 shadow-premium transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </motion.a>
  );
}
