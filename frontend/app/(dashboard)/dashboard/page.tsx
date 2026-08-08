// app/(dashboard)/dashboard/page.tsx
// "The Real Room" — Dashboard with Auth Guard & Analytics

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

// Static Content
const ANALYTICS_CHECKLIST = [
  "Communication",
  "Confidence",
  "Technical Skills",
  "AI Insights",
];

export default function DashboardPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const [isGuest, setIsGuest] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  // ---------------------------------------------------------------------------
  // Auth Guard
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestState = localStorage.getItem("isGuest") === "true";

    if (!token && !guestState) {
      router.push("/login");
    }
  }, [router]);

  // Sync Guest state & fetch analytics client-side (only if not guest)
  useEffect(() => {
    const guestState = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestState);

    if (!guestState) {
      apiFetch("/api/dashboard/analytics")
        .then((data) => setAnalytics(data))
        .catch((err) => console.error("Failed to load analytics:", err));
    }
  }, []);

  // Spotlight Mouse Tracking
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

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
    router.push("/login");
  };

  const ANALYTICS_METRICS = [
    {
      label: "Interviews Completed",
      value: analytics?.interviews_completed ?? "—",
    },
    {
      label: "Average Score",
      value: analytics?.average_score ?? "—",
    },
    {
      label: "Current Streak",
      value: analytics?.current_streak ?? "—",
    },
    {
      label: "DSA Solved",
      value: analytics?.dsa_solved ?? "—",
    },
  ];

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

      {/* Header Bar */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.2em] text-slate-300 transition hover:text-white"
        >
          THE REAL ROOM
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isGuest ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            {isGuest ? "Guest" : "Authenticated"}
          </div>

          {/* REQUIREMENT: Remove Sign Out option in Guest Mode */}
          {isGuest ? (
            <Link
              href="/login"
              className="rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
            >
              Sign In / Register
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-white/5 bg-white/[0.02] px-6 py-2.5 text-center text-xs text-slate-400 sm:text-sm">
          <span>Guest Mode — analytics, metrics, and session records are disabled.</span>
          <Link
            href="/login"
            className="font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            Create an Account →
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative overflow-hidden px-6 pb-28 pt-20 sm:px-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          style={{
            background: `radial-gradient(500px circle at ${spotlight.x}% ${spotlight.y}%, rgba(34,211,238,0.08), transparent 60%)`,
          }}
        />

        <div
          aria-hidden
          className="trr-orb-a pointer-events-none absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-[110px]"
        />
        <div
          aria-hidden
          className="trr-orb-b pointer-events-none absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-[110px]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Enter{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              The Real Room
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-balance text-slate-400">
            Practice company-specific AI interviews with voice, emotion, and
            live feedback.
          </p>

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
              <span className="text-sm text-cyan-100/70">
                Your AI interviewer is waiting.
              </span>
            </span>
          </Link>

          <p className="mt-5 text-xs uppercase tracking-[0.15em] text-slate-500">
            Choose Company · AI Interviewer · Live Feedback
          </p>
        </div>
      </div>

      {/* Analytics Section — Hidden or locked for Guests */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 sm:px-10">
        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Your interview analytics
          </h2>

          {isGuest ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur">
              <p className="text-3xl mb-2">🔒</p>
              <h3 className="text-lg font-bold text-white mb-1">Analytics Locked in Guest Mode</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Past track records, historical scores, and detailed AI performance breakdowns are only stored for registered users.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 shadow-lg"
              >
                Sign Up / Register to Save Track Records
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6 sm:grid-cols-4">
                {ANALYTICS_METRICS.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-2xl font-semibold text-slate-100">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <p className="mb-1 text-base font-medium text-white">
                  📊 Detailed Performance Breakdown
                </p>
                <p className="mb-5 text-sm text-slate-400">
                  Complete your interviews to evaluate:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {ANALYTICS_CHECKLIST.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <span className="text-cyan-300">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}