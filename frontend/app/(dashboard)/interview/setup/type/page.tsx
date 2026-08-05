// app/(dashboard)/interview/setup/type/page.tsx
// Next.js (App Router) + Tailwind — Choose Interview Type screen, matching The Real Room theme.

"use client";

import Link from "next/link";
import { useState } from "react";

const TYPES = [
  {
    id: "hr",
    name: "HR",
    description: "Behavioral questions, culture fit, and communication skills.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path
          d="M17 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 20v-1a3.5 3.5 0 0 0-2.5-3.36M15 4.2a3.5 3.5 0 0 1 0 6.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "technical",
    name: "Technical",
    description: "System design, concepts, and role-specific deep dives.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="m8 9-4 4 4 4M16 9l4 4-4 4M13.5 6.5l-3 11" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "dsa",
    name: "DSA",
    description: "Live coding: data structures, algorithms, complexity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.8}>
        <path
          d="M4 6h16M4 12h10M4 18h7M17 14v6m0 0 3-3m-3 3-3-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ChooseTypePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        {/* Step indicator */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-blue-400">
          Step 2 of 3
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-white sm:text-4xl">
          What kind of interview do you want?
        </h1>
        <p className="mt-3 text-center text-sm text-slate-400 sm:text-base">
          Pick the round you want to practice — you can always come back for another.
        </p>

        {/* Type cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {TYPES.map((type, i) => {
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelected(type.id)}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`group animate-fade-in-up flex flex-col items-start gap-3 rounded-xl border p-6 text-left opacity-0 transition-all duration-300 ${
                  isSelected
                    ? "border-blue-400/60 bg-blue-400/10 shadow-[0_0_24px_-4px_rgba(56,189,248,0.4)]"
                    : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-400 to-sky-500 text-white"
                      : "bg-white/5 text-slate-400 group-hover:text-white"
                  }`}
                >
                  {type.icon}
                </div>
                <h3
                  className={`text-base font-semibold transition-colors ${
                    isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                  }`}
                >
                  {type.name}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">{type.description}</p>
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div className="mt-12 flex items-center justify-between">
          <Link
            href="/interview/setup/company"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            <span aria-hidden>←</span>
            Back
          </Link>
          <Link
            href="/interview/setup/mood"
            aria-disabled={!selected}
            className={`inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium transition ${
              selected
                ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                : "pointer-events-none bg-white/10 text-slate-500"
            }`}
          >
            Continue
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