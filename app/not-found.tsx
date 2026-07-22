"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <span className="animate-float block bg-brand-gradient bg-clip-text font-display text-[7rem] font-bold leading-none text-transparent sm:text-[10rem]">
          404
        </span>

        <div className="mx-auto mt-4 max-w-md rounded-xl glass px-4 py-2.5 font-mono text-sm text-muted">
          <span className="text-primary">$</span> cd /səhifə:{" "}
          <span className="text-ink/80">no such file or directory</span>
        </div>

        <h1 className="mt-8 font-display text-2xl font-bold text-ink sm:text-3xl">
          Bu səhifə mövcud deyil
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Axtardığın səhifə silinib, köçürülüb və ya heç vaxt olmayıb. Ana səhifəyə qayıt.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            data-cursor
            className="group flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-medium text-background shadow-glow transition hover:shadow-glow-lg"
          >
            <Home size={17} /> Ana səhifə
          </Link>
          <Link
            href="/projects"
            data-cursor
            className="flex items-center gap-2 rounded-full border border-ink/12 px-6 py-3 font-medium text-ink transition hover:border-primary/50 hover:text-primary"
          >
            <ArrowLeft size={17} /> Layihələr
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
