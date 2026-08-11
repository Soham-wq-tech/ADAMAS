// app/page.tsx
// Next.js (App Router) + Tailwind landing page

"use client";

import { useEffect, useState } from "react";
import HowItWorks from "./components/landing/HowItWorks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AIInterviewBackground from "./components/landing/AIInterviewBackground";
import ThreeHero from "./components/landing/ThreeHero";
import Companies from "./components/landing/Companies";
import Footer from "./components/landing/Footer";

const PRODUCT_NAME = "The Real Room";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest") === "true";
    if (token || guestStatus) {
      setIsLoggedIn(true);
      setIsGuest(guestStatus);
    }
  }, []);

  const handleEnterRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest");
    if (token || guestStatus) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <AIInterviewBackground />
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-base font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition">
              {PRODUCT_NAME}
            </Link>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
            >
              How It Works
            </a>
            <a
              href="#companies"
              className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
            >
              Companies
            </a>
            <a
              href="#resources"
              className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
            >
              Resources
            </a>
          </div>

          {/* Dynamic Top Right Section: Defaults cleanly to Sign In until client mounts and verifies storage */}
          {mounted && isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${isGuest ? "bg-amber-400" : "bg-emerald-400"}`} />
                {isGuest ? "Guest" : "Authenticated"}
              </span>

              <Link
                href="/dashboard"
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center sm:pt-36">
        {/* Eyebrow badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Mock Interview Prep for Aspiring Students
        </span>

        {/* Headline */}
        <h1 className="mt-6 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          <span className="text-white">The </span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Real Room
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-slate-400 sm:text-lg">
          Master your placement interviews with an AI that listens, adapts, and pushes back —
          giving aspiring students a realistic simulation before stepping into the real room.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleEnterRoom}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-10 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-500/40 cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-3">
              Enter The Room
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>

        <ThreeHero />
      </section>

      <HowItWorks />

      <Companies />

      {/* Resources Section */}
      <section
        id="resources"
        className="relative z-10 mx-auto max-w-6xl px-6 py-24"
      >
        <div className="text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Resources & Sheets
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Prepare Before You Enter
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Choose a company DSA sheet below to view problem sets and download materials tailored for student success. More company sheets will be added in future updates.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Google Sheet Card */}
          <Link
            href="/resources/dsa/google"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition">
              Google DSA Sheet →
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              Problem-solving focused algorithmic questions curated for Google loops.
            </p>
          </Link>

          {/* Microsoft Sheet Card */}
          <Link
            href="/resources/dsa/microsoft"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition">
              Microsoft DSA Sheet →
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              Engineering fundamentals, core patterns, and frequent interview questions.
            </p>
          </Link>

          {/* Amazon Sheet Card */}
          <Link
            href="/resources/dsa/amazon"
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition">
              Amazon DSA Sheet →
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              High-frequency coding rounds and problem sets tailored for Amazon SDE tracks.
            </p>
          </Link>
        </div>

        {/* Future Notice Row */}
        <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
          Note: DSA sheets for NVIDIA, Apple, Meta, Atlassian, and other companies will be added in future updates.
        </div>
      </section>

      <Footer />
    </main>
  );
}