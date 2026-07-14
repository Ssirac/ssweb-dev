"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Command as CmdIcon } from "lucide-react";
import { LogoWordmark } from "./logo";
import { Magnetic } from "./ui/magnetic";
import { NAV_LINKS } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-[200] mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl glass-strong px-4 py-2.5 shadow-premium md:px-5"
      style={{ width: "min(92%, 64rem)" }}
    >
      <Link href="/" aria-label="Home" data-cursor>
        <LogoWordmark size={38} />
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.id}
            href={l.href}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
              isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"
            )}
          >
            {isActive(l.href) && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-primary/15 border border-primary/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t.nav[l.id as keyof typeof t.nav]}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setLang(lang === "en" ? "az" : "en")}
          className="flex items-center gap-1 rounded-lg border border-ink/10 bg-ink/5 px-2.5 py-1.5 font-mono text-[11px] uppercase text-muted transition hover:text-ink"
          aria-label={lang === "en" ? "Dili Azərbaycancaya keçir" : "Switch language to English"}
          data-cursor
        >
          {lang === "en" ? "AZ" : "EN"}
        </button>
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          className="hidden items-center gap-1.5 rounded-lg border border-ink/10 bg-ink/5 px-2.5 py-1.5 font-mono text-[11px] text-muted hover:text-ink md:flex"
          aria-label="Open command palette"
        >
          <CmdIcon size={12} /> K
        </button>
        <Magnetic className="hidden md:block">
          <Link
            href="/contact"
            className="block rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-background shadow-glow transition hover:shadow-glow-lg"
            data-cursor
          >
            {t.cta.letsTalk}
          </Link>
        </Magnetic>
        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-16 rounded-2xl glass-strong p-3 md:hidden"
        >
          {NAV_LINKS.map((l) => (
            <Link key={l.id} href={l.href} onClick={() => setOpen(false)}
              className={cn("block w-full rounded-lg px-4 py-3 text-left text-sm",
                isActive(l.href) ? "bg-primary/15 text-ink" : "text-muted")}>
              {t.nav[l.id as keyof typeof t.nav]}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
