"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, SKILLS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type Line = { cmd?: string; out: string[] };

export function Terminal() {
  const { lang } = useLang();
  const [history, setHistory] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const az = lang === "az";
  const banner = az
    ? ["ssweb.dev terminalına xoş gəldin.", "Əmrləri gör: `help` yaz."]
    : ["Welcome to the ssweb.dev terminal.", "Type `help` to see commands."];

  useEffect(() => { setHistory([{ out: banner }]); /* eslint-disable-next-line */ }, [lang]);
  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight); }, [history]);

  // Azerbaijani (and a few English) aliases → canonical command.
  const ALIASES: Record<string, string> = {
    kömək: "help", komek: "help", yardım: "help", yardim: "help",
    haqqında: "about", haqqinda: "about", haqqimda: "about", mən: "about",
    bacarıqlar: "skills", bacariqlar: "skills",
    layihələr: "projects", layiheler: "projects", işlər: "projects", isler: "projects",
    sosial: "socials", "sosial şəbəkələr": "socials",
    əlaqə: "contact", elaqe: "contact",
    kimsən: "whoami", kimsen: "whoami", "kim sən": "whoami",
    təmizlə: "clear", temizle: "clear", cls: "clear",
    salam: "hi", "salam əleyküm": "hi", salamlar: "hi", hello: "hi", hey: "hi", hi: "hi",
  };

  const run = (raw: string): string[] => {
    const input = raw.trim().toLowerCase();
    const cmd = ALIASES[input] ?? input;
    switch (cmd) {
      case "": return [];
      case "hi":
        return az
          ? ["Salam! 👋 `help` yazıb nə edə biləcəyimə bax."]
          : ["Hey there! 👋 Type `help` to see what I can do."];
      case "help":
        return az
          ? ["Əmrlər: help, about, skills, projects, socials, contact, whoami, clear", "(Azərbaycanca da yaza bilərsən: kömək, haqqında, layihələr, əlaqə…)"]
          : ["Available: help, about, skills, projects, socials, contact, whoami, clear"];
      case "whoami":
        return [`${PROFILE.name} — Junior Frontend Developer (Azerbaijan)`];
      case "about":
        return az
          ? ["DIV Academy məzunu. React, Next.js və TypeScript ilə real veb interfeyslər qururam."]
          : ["DIV Academy graduate. I build real web interfaces with React, Next.js and TypeScript."];
      case "skills":
        return [SKILLS.map((s) => s.name).join(", ")];
      case "projects":
        return ["1) MZ Personalvermittlung — recruitment site", "2) Original Brands Baku — e-commerce catalog", "→ /projects"];
      case "socials":
        return [`GitHub:    ${PROFILE.socials.github}`, `LinkedIn:  ${PROFILE.socials.linkedin}`, `Instagram: ${PROFILE.socials.instagram}`];
      case "contact":
        return [`Email:    ${PROFILE.email}`, `WhatsApp: ${PROFILE.whatsapp[0].display}`];
      case "clear":
        return ["__clear__"];
      default:
        return [az ? `əmr tapılmadı: ${cmd} — 'help' yaz` : `command not found: ${cmd} — try 'help'`];
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const out = run(value);
    if (out[0] === "__clear__") { setHistory([]); setValue(""); return; }
    setHistory((h) => [...h, { cmd: value, out }]);
    setValue("");
  };

  return (
    <section className="relative mx-auto max-w-3xl px-6 pb-28">
      <div className="overflow-hidden rounded-2xl glass shadow-premium" onClick={() => inputRef.current?.focus()}>
        <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <span className="h-3 w-3 rounded-full bg-green-400/70" />
          <span className="ml-2 font-mono text-xs text-muted">ssweb.dev — zsh</span>
        </div>
        <div ref={bodyRef} className="h-64 overflow-y-auto p-4 font-mono text-sm leading-relaxed">
          {history.map((l, i) => (
            <div key={i}>
              {l.cmd !== undefined && (
                <div className="text-ink"><span className="text-primary">$ </span>{l.cmd}</div>
              )}
              {l.out.map((o, j) => (
                <div key={j} className="whitespace-pre-wrap text-muted">{o}</div>
              ))}
            </div>
          ))}
          <form onSubmit={submit} className="flex items-center">
            <span className="text-primary">$&nbsp;</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              aria-label="terminal input"
              className="flex-1 bg-transparent text-ink outline-none"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
