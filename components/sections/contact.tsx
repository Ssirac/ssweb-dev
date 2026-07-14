"use client";
import { useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SectionHeader } from "../ui/section-header";
import { Magnetic } from "../ui/magnetic";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const SOCIALS = [
  { icon: FaWhatsapp, href: `https://wa.me/${PROFILE.whatsapp[0].number}`, label: "WhatsApp" },
  { icon: FaInstagram, href: PROFILE.socials.instagram, label: "Instagram" },
  { icon: FaGithub, href: PROFILE.socials.github, label: "GitHub" },
  { icon: FaLinkedin, href: PROFILE.socials.linkedin, label: "LinkedIn" },
];

// Set these in a .env.local file
const SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.contact.errName;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = t.contact.errEmail;
    if (form.message.trim().length < 10) e.message = t.contact.errMessage;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      if (SERVICE && TEMPLATE && PUBLIC_KEY) {
        await emailjs.send(SERVICE, TEMPLATE,
          { from_name: form.name, from_email: form.email, message: form.message }, PUBLIC_KEY);
      } else {
        await new Promise((r) => setTimeout(r, 900)); // demo fallback
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  };

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <section id="contact" className="section-anchor relative mx-auto max-w-4xl px-6 py-28">
      <SectionHeader tag={t.contact.tag} title={t.contact.title} subtitle={t.contact.subtitle} />

      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="flex flex-col justify-between rounded-3xl glass p-7 shadow-premium">
          <div>
            <h3 className="text-xl font-semibold text-ink">{t.contact.getInTouch}</h3>
            <a href={`mailto:${PROFILE.email}`}
              className="mt-3 block text-sm text-muted transition hover:text-primary">
              {PROFILE.email}
            </a>
            <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <FaWhatsapp size={14} /> WhatsApp
            </div>
            {PROFILE.whatsapp.map((w) => (
              <a key={w.number} href={`https://wa.me/${w.number}`} target="_blank" rel="noopener noreferrer"
                className="mt-1.5 block font-mono text-sm text-muted transition hover:text-primary">
                {w.display}
              </a>
            ))}
            <p className="mt-4 text-sm text-muted">{t.contact.availability}</p>
          </div>
          <div className="mt-8 flex gap-3">
            {SOCIALS.map((s) => (
              <Magnetic key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} data-cursor
                  className="flex h-11 w-11 items-center justify-center rounded-xl glass text-muted transition hover:border-primary/40 hover:text-primary hover:shadow-glow">
                  <s.icon size={18} />
                </a>
              </Magnetic>
            ))}
          </div>
        </motion.div>

        <motion.form onSubmit={submit}
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="space-y-4 rounded-3xl glass p-7 shadow-premium">
          <div>
            <input {...field("name")} placeholder={t.contact.name} aria-label={t.contact.name}
              autoComplete="name" aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-name" : undefined}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-muted outline-none transition focus:border-primary/50" />
            {errors.name && <p id="err-name" className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <input {...field("email")} type="email" placeholder={t.contact.email} aria-label={t.contact.email}
              autoComplete="email" aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-muted outline-none transition focus:border-primary/50" />
            {errors.email && <p id="err-email" className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <textarea {...field("message")} rows={5} placeholder={t.contact.message} aria-label={t.contact.messageLabel}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "err-message" : undefined}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder:text-muted outline-none transition focus:border-primary/50" />
            {errors.message && <p id="err-message" className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <Magnetic>
            <button type="submit" disabled={status === "sending"} data-cursor
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-medium text-background shadow-glow transition hover:shadow-glow-lg disabled:opacity-60">
              {status === "sending" ? t.contact.sending :
               status === "sent" ? <><CheckCircle2 size={18} /> {t.contact.sent}</> :
               status === "error" ? <><AlertCircle size={18} /> {t.contact.tryAgain}</> :
               <>{t.contact.send} <Send size={16} /></>}
            </button>
          </Magnetic>
        </motion.form>
      </div>
    </section>
  );
}
