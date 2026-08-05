// app/dashboard/page.tsx
// "The Real Room" — Guest Dashboard
// Premium AI SaaS look: Linear-style structure, OpenAI-style glow, Stripe-style focus.
// The Enter The Real Room CTA is the singular hero moment; everything else is quiet by comparison.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const ANALYTICS_METRICS = [
  { label: "Interviews Completed", value: "—" },
  { label: "Average Score", value: "—" },
  { label: "Current Streak", value: "—" },
  { label: "DSA Solved", value: "—" },
];

const ANALYTICS_CHECKLIST = ["Communication", "Confidence", "Technical Skills", "AI Insights"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const isGuest = true; // TODO: replace with real session/auth state from your backend

  const heroRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <main className="min-h-screen bg-black text-slate-100">
      <style>{`
        @keyframes trr-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-3%, 4%); }
        }
        @keyframes trr-drift-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(4%, -3%); }
        }
        @keyframes trr-shine {
          0% { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(220%) skewX(-20deg); }
        }
        @keyframes trr-breathe {
          0%, 100% { box-shadow: 0 0 40px 0 rgba(34, 211, 238, 0.35), 0 0 0 1px rgba(255,255,255,0.08) inset; }
          50% { box-shadow: 0 0 70px 10px rgba(34, 211, 238, 0.5), 0 0 0 1px rgba(255,255,255,0.12) inset; }
        }
        @keyframes trr-float {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-14px); opacity: 1; }
        }
        .trr-cta { animation: trr-breathe 4.5s ease-in-out infinite; }
        .trr-cta:active { transform: translateY(0) scale(0.98); }
        .trr-shine-sweep { animation: trr-shine 5s ease-in-out infinite; }
        .trr-orb-a { animation: trr-drift 14s ease-in-out infinite; }
        .trr-orb-b { animation: trr-drift-slow 18s ease-in-out infinite; }
        .trr-node { animation: trr-float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .trr-cta, .trr-shine-sweep, .trr-orb-a, .trr-orb-b, .trr-node {
            animation: none !important;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Top bar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.2em] text-slate-300 transition hover:text-white"
        >
          THE REAL ROOM
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Guest
        </div>
      </header>

      {/* Guest mode notice */}
      {isGuest && (
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-white/5 bg-white/[0.02] px-6 py-2.5 text-center text-xs text-slate-400 sm:text-sm">
          <span>Guest Mode — your progress won&apos;t be saved.</span>
          <Link href="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200">
            Sign In →
          </Link>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <div ref={heroRef} className="relative overflow-hidden px-6 pb-28 pt-20 sm:px-10">
        {/* Cursor spotlight (desktop only) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          style={{
            background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(34,211,238,0.08), transparent 60%)`,
          }}
        />

        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="trr-orb-a pointer-events-none absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-[110px]"
        />
        <div
          aria-hidden
          className="trr-orb-b pointer-events-none absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-[110px]"
        />

        {/* Faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
          }}
        />

        {/* Floating AI nodes */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 800 400"
        >
          <line x1="120" y1="90" x2="260" y2="150" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
          <line x1="260" y1="150" x2="420" y2="70" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
          <line x1="540" y1="180" x2="420" y2="70" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
          <line x1="540" y1="180" x2="680" y2="120" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
        </svg>
        <div className="trr-node pointer-events-none absolute left-[14%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan-300 [animation-delay:0.2s]" />
        <div className="trr-node pointer-events-none absolute left-[33%] top-[35%] h-1 w-1 rounded-full bg-cyan-200 [animation-delay:1.1s]" />
        <div className="trr-node pointer-events-none absolute left-[52%] top-[16%] h-1.5 w-1.5 rounded-full bg-indigo-300 [animation-delay:0.6s]" />
        <div className="trr-node pointer-events-none absolute left-[67%] top-[42%] h-1 w-1 rounded-full bg-indigo-200 [animation-delay:1.6s]" />
        <div className="trr-node pointer-events-none absolute left-[85%] top-[26%] h-1.5 w-1.5 rounded-full bg-cyan-300 [animation-delay:0.9s]" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Enter{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              The Real Room
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-balance text-slate-400">
            Practice company-specific AI interviews with voice, emotion, and live feedback.
          </p>

          {/* The CTA — the identity of this dashboard */}
          <Link
            href="/interview"
            className="trr-cta group relative mt-12 flex w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[28px] border border-cyan-300/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-8 py-7 backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          >
            <span
              aria-hidden
              className="trr-shine-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <span className="relative flex flex-col items-center gap-1">
              <span className="flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                 Start Interview
              </span>
              <span className="text-sm text-cyan-100/70">Your AI interviewer is waiting.</span>
            </span>
          </Link>

          <p className="mt-5 text-xs uppercase tracking-[0.15em] text-slate-500">
            Choose Company · AI Interviewer · Live Feedback
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Analytics                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 sm:px-10">
        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Your interview analytics
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            {/* Metric strip */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6 sm:grid-cols-4">
              {ANALYTICS_METRICS.map((metric) => (
                <div key={metric.label}>
                  <p className="text-2xl font-semibold text-slate-600">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Empty-state message */}
            <div className="pt-6">
              <p className="mb-1 text-base font-medium text-white">📊 No insights yet</p>
              <p className="mb-5 text-sm text-slate-400">
                Complete your first interview to unlock:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {ANALYTICS_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-cyan-300">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}