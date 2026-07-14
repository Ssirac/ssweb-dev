"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Home, User, Wrench, FolderGit2, Github, Mail } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const ICONS: Record<string, React.ElementType> = {
  hero: Home, about: User, skills: Wrench, services: Wrench,
  projects: FolderGit2, github: Github, contact: Mail,
};

export function CommandPalette() {
  const { t } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9000] flex items-start justify-center bg-black/60 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96, y: -10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl glass-strong shadow-glow-lg"
          >
            <Command className="[&_[cmdk-input]]:outline-none">
              <Command.Input
                autoFocus
                placeholder={t.cmd.placeholder}
                className="w-full border-b border-white/10 bg-transparent px-5 py-4 text-ink placeholder:text-muted"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted">{t.cmd.noResults}</Command.Empty>
                <Command.Group heading={t.cmd.navigate} className="px-2 py-1 text-xs text-muted">
                  {NAV_LINKS.map((l) => {
                    const Icon = ICONS[l.id] ?? Home;
                    return (
                      <Command.Item
                        key={l.id}
                        onSelect={() => go(l.href)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/90 data-[selected=true]:bg-primary/20"
                      >
                        <Icon size={16} className="text-primary" /> {t.nav[l.id as keyof typeof t.nav]}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
                <Command.Group heading={t.cmd.actions} className="px-2 py-1 text-xs text-muted">
                  <Command.Item
                    onSelect={() => { window.open(PROFILE.socials.github, "_blank"); setOpen(false); }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/90 data-[selected=true]:bg-primary/20"
                  >
                    <Github size={16} className="text-primary" /> {t.cmd.openGithub}
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
