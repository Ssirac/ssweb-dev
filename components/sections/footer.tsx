"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Logo } from "../logo";
import { Magnetic } from "../ui/magnetic";
import { NAV_LINKS, PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const SOCIALS = [
  { icon: FaWhatsapp, href: `https://wa.me/${PROFILE.whatsapp[0].number}`, label: "WhatsApp" },
  { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram" },
  { icon: FaGithub, href: PROFILE.socials.github, label: "GitHub" },
  { icon: FaLinkedin, href: PROFILE.socials.linkedin, label: "LinkedIn" },
];

export function Footer() {
  const { t } = useLang();
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <footer className="relative border-t border-ink/5 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <Logo size={64} showSymbols />
        </motion.div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.id} href={l.href}
              className="text-sm text-muted transition hover:text-ink">
              {t.nav[l.id as keyof typeof t.nav]}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              aria-label={s.label} data-cursor
              className="flex h-10 w-10 items-center justify-center rounded-xl glass text-muted transition hover:border-primary/40 hover:text-primary hover:shadow-glow">
              <s.icon size={17} />
            </a>
          ))}
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-ink/5 pt-8 md:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} <span className="text-ink">SS Developer</span>. {t.footer.crafted}
          </p>
          <Magnetic>
            <button onClick={top} data-cursor
              className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-ink transition hover:border-primary/40 hover:shadow-glow">
              {t.cta.backToTop} <ArrowUp size={15} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
