"use client";

// Taped-card footer (adapted from the 21st.dev footer-taped-design): a glass
// card with translucent "masking tape" corners and three link columns, plus
// the previous footer's bottom bar (copyright, socials, back to top). The
// original's daisyUI tokens are mapped to ours and its dead "soon" links
// were dropped; every link here is real.

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Gamepad2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Logo } from "../logo";
import { Magnetic } from "../ui/magnetic";
import { NAV_LINKS, PROFILE, PROJECTS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const SOCIALS = [
  { icon: FaWhatsapp, href: `https://wa.me/${PROFILE.whatsapp[0].number}`, label: "WhatsApp" },
  { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram" },
  { icon: FaTiktok, href: PROFILE.socials.tiktok, label: "TikTok" },
  { icon: FaGithub, href: PROFILE.socials.github, label: "GitHub" },
  { icon: FaLinkedin, href: PROFILE.socials.linkedin, label: "LinkedIn" },
];

// Masking-tape corner decoration (from the 21st.dev original, recolored via
// currentColor so it reads as frosted tape on the dark theme).
const Tape = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="95" height="80" viewBox="0 0 95 80" fill="none" className={className} aria-hidden>
    <path d="M1 45L70.282 5L88.282 36.1769L19 76.1769L1 45Z" fill="currentColor" />
  </svg>
);

const linkCls = "text-sm text-muted transition hover:text-ink";
const headCls = "font-mono text-xs uppercase tracking-widest text-muted/70";

export function Footer() {
  const { t, lang } = useLang();
  const az = lang === "az";
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative px-6 py-14">
      {/* taped glass card */}
      <div className="relative mx-auto max-w-5xl rounded-3xl glass p-8 shadow-premium md:p-10">
        <Tape className="absolute -left-6 -top-5 hidden w-[72px] scale-90 text-ink/15 md:block" />
        <Tape className="absolute -right-6 -top-5 hidden w-[72px] rotate-90 scale-90 text-ink/15 md:block" />

        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* brand */}
          <div className="flex max-w-xs flex-col items-start gap-3">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Logo size={56} showSymbols />
            </motion.div>
            <p className="text-sm leading-relaxed text-muted">
              {az
                ? "Müasir, sürətli və yaddaqalan veb interfeyslər."
                : "Modern, fast and memorable web interfaces."}
            </p>
          </div>

          {/* link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:max-w-xl md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <h4 className={headCls}>{az ? "Səhifələr" : "Pages"}</h4>
              {NAV_LINKS.map((l) => (
                <Link key={l.id} href={l.href} className={linkCls}>
                  {t.nav[l.id as keyof typeof t.nav]}
                </Link>
              ))}
              <Link href="/play" className={`${linkCls} flex items-center gap-1.5`}>
                <Gamepad2 size={13} /> {t.footer.play}
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className={headCls}>{az ? "Layihələr" : "Projects"}</h4>
              {PROJECTS.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className={linkCls}>
                  {p.title}
                </Link>
              ))}
            </div>

            <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
              <h4 className={headCls}>{az ? "Əlaqə" : "Contact"}</h4>
              <a href={`mailto:${PROFILE.email}`} className={linkCls}>
                {PROFILE.email}
              </a>
              <a
                href={`https://wa.me/${PROFILE.whatsapp[0].number}`}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                WhatsApp: {PROFILE.whatsapp[0].display}
              </a>
              <a href={`tel:+${PROFILE.whatsapp[0].number}`} className={linkCls}>
                {az ? "Zəng" : "Call"}: {PROFILE.whatsapp[0].display}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="mx-auto mt-6 flex max-w-5xl flex-col items-center justify-between gap-4 px-2 md:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} <span className="text-ink">SS Developer</span>. {t.footer.crafted}
        </p>

        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              data-cursor
              className="flex h-10 w-10 items-center justify-center rounded-xl glass text-muted transition hover:border-primary/40 hover:text-primary hover:shadow-glow"
            >
              <s.icon size={16} />
            </a>
          ))}
          <Magnetic>
            <button
              onClick={top}
              data-cursor
              className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-ink transition hover:border-primary/40 hover:shadow-glow"
            >
              {t.cta.backToTop} <ArrowUp size={15} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
