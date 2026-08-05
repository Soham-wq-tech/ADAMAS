// app/(dashboard)/feedback/page.tsx
// Next.js (App Router) + Tailwind — Feedback screen, matching The Real Room theme.
// Data below is dummy/local. Replace SCORE, SKILL_BREAKDOWN, STRENGTHS, IMPROVEMENTS,
// and QUESTION_FEEDBACK with the real payload from your backend once the AI scoring is wired up.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const OVERALL_SCORE = 78;

const SKILL_BREAKDOWN = [
  { label: "Communication", score: 85 },
  { label: "Technical Depth", score: 72 },
  { label: "Problem Solving", score: 80 },
  { label: "Confidence", score: 68 },
];

const STRENGTHS = [
  "Clearly explained the trade-offs behind your design choice.",
  "Gave a concrete, specific example rather than a generic answer.",
  "Stayed calm and structured when the follow-up got harder.",
];

const IMPROVEMENTS = [
  "Quantify impact where possible — numbers make claims more convincing.",
  "A few answers ran long; aim to land the core point within 60-90 seconds.",
  "When unsure, say so directly instead of hedging around the gap.",
];

const QUESTION_FEEDBACK = [
  {
    question: "Tell me about a project you're proud of.",
    score: 82,
    note: "Strong structure (situation → action → result). Could add a measurable outcome.",
  },
  {
    question: "Can you go deeper on the specific decision you made there?",
    score: 74,
    note: "Good reasoning, but the answer wandered before reaching the actual decision.",
  },
];

function ScoreRing({ score }: { score: number }) {
  const [progress, setProgress] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}%</span>
        <span className="text-xs text-slate-500">Overall</span>
      </div>
    </div>
  );
}

function SkillBar({ label, score }: { label: string; score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-medium text-white">{score}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-blue-400">
          Session Complete
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-white sm:text-4xl">Your Feedback</h1>
        <p className="mt-3 text-center text-sm text-slate-400">
          Google · Technical · Professional mode
        </p>

        {/* Score + skill breakdown */}
        <div className="mt-10 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur sm:grid-cols-[auto_1fr]">
          <div className="flex justify-center sm:justify-start">
            <ScoreRing score={OVERALL_SCORE} />
          </div>
          <div className="flex flex-col justify-center gap-4">
            {SKILL_BREAKDOWN.map((s) => (
              <SkillBar key={s.label} label={s.label} score={s.score} />
            ))}
          </div>
        </div>

        {/* Strengths + improvements */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Strengths
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {STRENGTHS.map((s, i) => (
                <li key={i} className="text-sm leading-relaxed text-slate-300">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Areas to Improve
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {IMPROVEMENTS.map((s, i) => (
                <li key={i} className="text-sm leading-relaxed text-slate-300">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold text-white">Question-by-Question</h2>
          <div className="mt-4 flex flex-col divide-y divide-white/5">
            {QUESTION_FEEDBACK.map((q, i) => (
              <div key={i} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-slate-200">{q.question}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      q.score >= 80
                        ? "bg-emerald-400/10 text-emerald-400"
                        : q.score >= 60
                        ? "bg-amber-400/10 text-amber-400"
                        : "bg-red-400/10 text-red-400"
                    }`}
                  >
                    {q.score}%
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{q.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dsa-sheet"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-7 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Practice DSA Sheet
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}