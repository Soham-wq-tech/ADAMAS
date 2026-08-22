// app/socratic/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, BarChart3, LogOut, ShieldAlert } from "lucide-react";

export default function SocraticDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest") === "true";

    if (!token && !guestStatus) {
      router.push("/login?redirect=/socratic/dashboard");
    } else {
      setIsGuest(guestStatus);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("lastMode");
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-base font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              The Real Room
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-medium">
              Socratic Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isGuest ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              {isGuest ? "Guest Mode" : "Authenticated"}
            </span>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 cursor-pointer"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Socratic Studio Control Panel
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Choose your primary dialectic workspace or inspect your past session performance logs.
          </p>
        </div>

        {/* Stacked Layout with Extreme Visual Hierarchy */}
        <div className="space-y-6">
          
          {/* PRIMARY HERO CARD: Highly Highlighted & Much Bigger */}
          <div className="relative rounded-3xl border-2 border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-black p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-all hover:border-cyan-400 overflow-hidden group">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none group-hover:bg-cyan-400/30 transition" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={14} className="animate-pulse" /> Primary Workspace
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Enter Dialectic Room
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  Launch your active Socratic reasoning chain, take on live conceptual probing, and unlock multi-tier progressive hints.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/socratic/room"
                  className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-8 py-5 text-base font-black text-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.4)] whitespace-nowrap"
                >
                  Launch Room <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* SECONDARY CARD: Historical Data / Analysis Logs with Guest Restriction */}
          <div className={`rounded-2xl border p-6 sm:p-7 backdrop-blur transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isGuest 
              ? "border-amber-500/30 bg-amber-500/5" 
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}>
            <div className="space-y-1.5 max-w-md">
              <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold ${
                isGuest ? "text-amber-400" : "text-slate-400"
              }`}>
                {isGuest ? <ShieldAlert size={14} /> : <BarChart3 size={14} className="text-slate-400" />} 
                {isGuest ? "Restricted in Guest Mode" : "Historical Data"}
              </span>
              <h4 className="text-lg font-bold text-slate-200">
                Concept Reasoning Maps & Analysis Logs
              </h4>
              <p className="text-xs text-slate-400">
                {isGuest
                  ? "Permanent history logs and performance metrics require an authenticated account."
                  : "Review past dialectic performance graphs and historical probing traces."}
              </p>
            </div>

            <div>
              {isGuest ? (
                <button
                  disabled
                  className="inline-flex items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-300/60 cursor-not-allowed whitespace-nowrap"
                >
                  Locked for Guests
                </button>
              ) : (
                <Link
                  href="/socratic/analysis"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer whitespace-nowrap"
                >
                  View Analysis Logs →
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Return to Landing Page banner option */}
        <div className="mt-12 border-t border-white/10 pt-6 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500">Need to switch modes?</span>
          <Link
            href="/"
            className="font-medium text-cyan-400 hover:underline transition"
          >
            ← Back to Main Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}