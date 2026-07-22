"use client";

// Pulsing "open to work" badge with live Baku time. Updates every 30s — cheap.

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

export function AvailabilityBadge() {
  const { lang } = useLang();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Baku",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, []);

  const az = lang === "az";
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-xs text-muted">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </span>
      <span>
        {az ? "İşə açığam" : "Open to work"} · {az ? "Bakı" : "Baku"} {time || "--:--"} ·{" "}
        {az ? "adətən 30 dəqiqə içində cavab" : "usually replies within 30 minutes"}
      </span>
    </div>
  );
}
