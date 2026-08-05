"use client";

import Link from "next/link";

interface HeaderProps {
  company: string;
  type: string;
  mood: string;
}

export default function Header({
  company,
  type,
  mood,
}: HeaderProps) {
  return (
    <header className="relative z-20 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-5 backdrop-blur-xl">

      <div>
        <h1 className="text-2xl font-bold text-white">
          THE REAL ROOM
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          AI Powered Mock Interview
        </p>
      </div>

      <div className="hidden gap-5 md:flex">

        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-cyan-300">
            Company
          </p>

          <p className="mt-1 font-semibold text-white">
            {company}
          </p>
        </div>

        <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-blue-300">
            Interview
          </p>

          <p className="mt-1 font-semibold capitalize text-white">
            {type}
          </p>
        </div>

        <div className="rounded-xl border border-purple-400/20 bg-purple-400/10 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-purple-300">
            Mood
          </p>

          <p className="mt-1 font-semibold capitalize text-white">
            {mood}
          </p>
        </div>

      </div>

      <Link
        href="/dashboard"
        className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
      >
        End Interview
      </Link>
    </header>
  );
}