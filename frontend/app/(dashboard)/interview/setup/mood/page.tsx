// app/(dashboard)/interview/setup/mood/page.tsx
// Next.js (App Router) + Tailwind — Choose Interview Mood screen, matching The Real Room theme.
// Interactive: hovering/selecting a mood live-updates a typewriter preview of how the AI will sound.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type React from "react";

const MOODS = [
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm, encouraging, puts you at ease.",
    sample: "Hey! No pressure at all — walk me through your background whenever you're ready.",
    color: "from-emerald-400 to-teal-400",
    glow: "rgba(52,211,153,0.4)",
    ring: "border-emerald-400/60 bg-emerald-400/10",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Neutral, structured, straight to the point.",
    sample: "Let's begin. Please describe a project you led and the outcome it produced.",
    color: "from-blue-400 to-sky-500",
    glow: "rgba(56,189,248,0.4)",
    ring: "border-blue-400/60 bg-blue-400/10",
  },
  {
    id: "strict",
    name: "Strict",
    description: "Formal, terse, expects precise answers.",
    sample: "Be specific. What exactly was your individual contribution, not the team's?",
    color: "from-amber-400 to-orange-500",
    glow: "rgba(251,146,60,0.4)",
    ring: "border-amber-400/60 bg-amber-400/10",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "High-pressure, interrupts, challenges everything.",
    sample: "That's not a real answer. Try again — and this time, convince me.",
    color: "from-red-400 to-rose-500",
    glow: "rgba(248,113,113,0.4)",
    ring: "border-red-400/60 bg-red-400/10",
  },
];

function TypewriterPreview({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-base leading-relaxed text-white sm:text-lg">
      {displayed}
      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-blue-400 align-middle" />
    </p>
  );
}

export default function ChooseMoodPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = MOODS.find((m) => m.id === (hovered ?? selected)) ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      {/* Ambient glow — tints toward the active mood's color */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[130px] transition-colors duration-500"
        style={{ backgroundColor: active ? active.glow : "rgba(56,189,248,0.12)" }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        {/* Step indicator */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-blue-400">
          Step 3 of 3
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-white sm:text-4xl">
          Set the interviewer's mood
        </h1>
        <p className="mt-3 text-center text-sm text-slate-400 sm:text-base">
          Hover a mood to preview how it sounds. Click to lock it in.
        </p>

        {/* Live preview panel */}
        <div className="mt-10 min-h-[104px] rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {active ? `${active.name} mode` : "Hover a mood below"}
          </p>
          <div className="mt-2">
            {active ? (
              <TypewriterPreview text={active.sample} />
            ) : (
              <p className="text-base text-slate-600">Your interviewer's opening line will appear here...</p>
            )}
          </div>
        </div>

        {/* Mood cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {MOODS.map((mood, i) => {
            const isSelected = selected === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelected(mood.id)}
                onMouseEnter={() => setHovered(mood.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(mood.id)}
                onBlur={() => setHovered(null)}
                style={{ animationDelay: `${i * 80}ms`, ["--glow" as string]: mood.glow } as React.CSSProperties}
                className={`group animate-fade-in-up flex items-center gap-4 rounded-xl border p-5 text-left opacity-0 transition-all duration-300 ${
                  isSelected
                    ? `${mood.ring} shadow-[0_0_28px_-6px_var(--glow)]`
                    : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 ${mood.color}`}
                >
                  {mood.name.charAt(0)}
                </div>
                <div>
                  <h3
                    className={`text-sm font-semibold transition-colors ${
                      isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {mood.name}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{mood.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div className="mt-12 flex items-center justify-between">
          <Link
            href="/interview/setup/type"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <span aria-hidden>←</span>
            Back
          </Link>
          <Link
            href="/interview"
            aria-disabled={!selected}
            className={`inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium transition ${
              selected
                ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                : "pointer-events-none bg-white/10 text-slate-500"
            }`}
          >
            Start Interview
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}