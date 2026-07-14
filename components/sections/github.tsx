"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, GitFork, Users, BookMarked } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { GlowCard } from "../ui/glow-card";
import { CountUp } from "../ui/count-up";
import { PROFILE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

type GHUser = { avatar_url: string; public_repos: number; followers: number; following: number; name: string; bio: string };
type Repo = { id: number; name: string; description: string; stargazers_count: number; forks_count: number; html_url: string; language: string };

export function GithubStats() {
  const { t } = useLang();
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${PROFILE.github}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${PROFILE.github}/repos?sort=stars&per_page=100`, { signal: controller.signal }),
        ]);
        if (!u.ok || !r.ok) throw new Error();
        const ud = await u.json();
        const rd: Repo[] = await r.json();
        const sorted = [...rd].sort((a, b) => b.stargazers_count - a.stargazers_count);
        setUser(ud);
        setTotalStars(rd.reduce((s, repo) => s + repo.stargazers_count, 0));
        setRepos(sorted.slice(0, 4));
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError(true);
      }
    })();
    return () => controller.abort();
  }, []);
  const stats = [
    { icon: BookMarked, label: t.github.stats.repos, value: user?.public_repos ?? "—" },
    { icon: Star, label: t.github.stats.stars, value: error ? "—" : totalStars },
    { icon: Users, label: t.github.stats.followers, value: user?.followers ?? "—" },
    { icon: GitFork, label: t.github.stats.following, value: user?.following ?? "—" },
  ];

  return (
    <section id="github" className="section-anchor relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader tag={t.github.tag} title={t.github.title}
        subtitle={`${t.github.subtitlePrefix} @${PROFILE.github}`} />

      {error && (
        <p className="mb-8 text-center text-sm text-muted">
          {t.github.error} <code className="text-primary">PROFILE.github</code> — <code>lib/data.ts</code>.
        </p>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <GlowCard className="text-center">
              <s.icon className="mx-auto text-primary" size={22} />
              <div className="mt-3 text-3xl font-bold text-ink"><CountUp text={s.value} /></div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div className="mb-10 overflow-hidden rounded-3xl glass p-4 shadow-premium">
        {/* GitHub contribution chart via ghchart (no auth needed) */}
        <Image
          src={`https://ghchart.rshah.org/4550F5/${PROFILE.github}`}
          alt="GitHub contributions" width={880} height={140}
          className="mx-auto w-full" unoptimized
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {repos.map((r, i) => (
          <motion.a key={r.id} href={r.html_url} target="_blank" rel="noopener noreferrer" data-cursor
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <GlowCard>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-ink">{r.name}</h4>
                {r.language && <span className="font-mono text-xs text-primary">{r.language}</span>}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{r.description || t.github.noDescription}</p>
              <div className="mt-4 flex gap-4 text-xs text-muted">
                <span className="flex items-center gap-1"><Star size={13} /> {r.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={13} /> {r.forks_count}</span>
              </div>
            </GlowCard>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
