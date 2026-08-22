// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import HowItWorks from "./components/landing/HowItWorks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AIInterviewBackground from "./components/landing/AIInterviewBackground";
import ThreeHero from "./components/landing/ThreeHero";
import Footer from "./components/landing/Footer";

const PRODUCT_NAME = "The Real Room";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard");
  const [buttonLabel, setButtonLabel] = useState("Go to Interview Dashboard →");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest") === "true";
    const lastMode = localStorage.getItem("lastMode");

    if (token || guestStatus) {
      setIsLoggedIn(true);
      setIsGuest(guestStatus);
      if (lastMode === "socratic") {
        setRedirectPath("/socratic/dashboard");
        setButtonLabel("Go to Socratic Dashboard →");
      } else {
        setRedirectPath("/dashboard");
        setButtonLabel("Go to Interview Dashboard →");
      }
    }
  }, []);

  const handleEnterRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("lastMode", "interview");
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest");
    if (token || guestStatus) {
      router.push("/dashboard");
    } else {
      router.push("/login?redirect=/dashboard");
    }
  };

  const handleEnterSocratic = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem("lastMode", "socratic");
    const token = localStorage.getItem("token");
    const guestStatus = localStorage.getItem("isGuest");
    if (token || guestStatus) {
      router.push("/socratic/dashboard");
    } else {
      router.push("/login?redirect=/socratic/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <AIInterviewBackground />

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-base font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              {PRODUCT_NAME}
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#modes"
              className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
            >
              Modes
            </a>
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
              Target Companies
            </a>
            <a
              href="#resources"
              className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
            >
              Resources
            </a>
          </div>

          {/* Dynamic Top Right Section */}
          {mounted && isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isGuest ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                {isGuest ? "Guest" : "Authenticated"}
              </span>

              <Link
                href={redirectPath}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
              >
                {buttonLabel}
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

      {/* Ambient glows */}
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
          AI Mock Interviews & Socratic Learning for Aspiring Students
        </span>

        {/* Headline */}
        <h1 className="mt-6 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          <span className="text-white">The </span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Real Room
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-slate-400 sm:text-lg">
          Master your placement interviews and deep technical concepts with an AI that listens, adapts, and pushes back — giving you realistic simulations and guided mastery before stepping in.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Button 1: Enter The Interview Room */}
          <button
            onClick={handleEnterRoom}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-8 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-500/40 cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-3">
              Enter The Interview Room
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>

          {/* Button 2: Socratic Mode */}
          <button
            onClick={handleEnterSocratic}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-8 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-500/40 cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-3">
              Socratic Mode
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>

        <ThreeHero />
      </section>

      {/* Modes Overview Section */}
      <section id="modes" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Dual Learning Engines
          </span>
          <h2 className="mt-6 text-4xl font-bold text-white">
            Choose Your Preparation Pathway
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Whether you want a high-stakes, pressure-tested mock interview or step-by-step guided problem-solving through dialogue, our platform adapts to your prep style.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Real Room Mode Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Simulated Assessment
              </span>
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">The Real Room</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              A high-fidelity interview loop designed to mimic tier-1 engineering rounds. The AI interviewer tests your technical depths, questions bad complexity choices, and evaluates communication under pressure.
            </p>
            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Dynamic company-specific question sets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Real-time speech & code analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Post-interview performance analytics
              </li>
            </ul>
            <div className="mt-8">
              <button
                onClick={handleEnterRoom}
                className="w-full rounded-xl border border-cyan-500/40 bg-cyan-500/20 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/30 cursor-pointer"
              >
                Launch Interview Room →
              </button>
            </div>
          </div>

          {/* Socratic Mode Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
                Guided Discovery
              </span>
              <span className="text-2xl">✦</span>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Socratic Studio</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              A dialectic tutor environment that never gives away solutions outright. Instead, it asks targeted probing questions, maps your mental conceptual leaps, and unlocks progressive hints.
            </p>
            <ul className="mt-6 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Interactive concept progression graph
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Multi-tier progressive hint system
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Deep algorithmic reasoning breakdown
              </li>
            </ul>
            <div className="mt-8">
              <button
                onClick={handleEnterSocratic}
                className="w-full rounded-xl border border-blue-500/40 bg-blue-500/20 py-3 text-sm font-bold text-blue-300 transition hover:bg-blue-500/30 cursor-pointer"
              >
                Enter Socratic Studio →
              </button>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Target Companies Section */}
      <section id="companies" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Curated Interview Loops
          </span>
          <h2 className="mt-6 text-4xl font-bold text-white">
            Target Companies We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Simulate exact recruitment patterns, coding challenges, and technical rounds tailored for top-tier technology firms.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Google */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Google</span>
              <span className="text-xs rounded bg-blue-500/20 px-2 py-0.5 text-blue-300 font-mono">G</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Focuses on rigorous algorithmic optimization, tree/graph structures, and scalable system design principles.
            </p>
          </div>

          {/* Microsoft */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Microsoft</span>
              <span className="text-xs rounded bg-sky-500/20 px-2 py-0.5 text-sky-300 font-mono">M</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Tests core computer science fundamentals, object-oriented design patterns, and practical problem-solving.
            </p>
          </div>

          {/* Amazon */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Amazon</span>
              <span className="text-xs rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 font-mono">A</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Emphasizes high-frequency coding rounds, concurrency, and behavioral integration based on Leadership Principles.
            </p>
          </div>

          {/* NVIDIA */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">NVIDIA</span>
              <span className="text-xs rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-mono">N</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Centers heavily on low-level programming, memory management, graphics architecture, and parallel computing.
            </p>
          </div>

          {/* Apple */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Apple</span>
              <span className="text-xs rounded bg-purple-500/20 px-2 py-0.5 text-purple-300 font-mono">A</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Assesses tight code efficiency, deep system debugging capabilities, and meticulous attention to product quality.
            </p>
          </div>

          {/* Meta */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Meta</span>
              <span className="text-xs rounded bg-blue-600/20 px-2 py-0.5 text-blue-400 font-mono">M</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Requires fast-paced coding execution, dynamic programming mastery, and rapid system scaling analysis.
            </p>
          </div>

          {/* Atlassian */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Atlassian</span>
              <span className="text-xs rounded bg-cyan-600/20 px-2 py-0.5 text-cyan-300 font-mono">A</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Focuses on clean code extensibility, API design practices, and collaborative troubleshooting scenarios.
            </p>
          </div>

          {/* Uber */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-cyan-400/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Uber</span>
              <span className="text-xs rounded bg-zinc-700/40 px-2 py-0.5 text-slate-300 font-mono">U</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Targets complex distributed systems, real-time data streaming architectures, and heavy algorithmic challenges.
            </p>
          </div>
        </div>
      </section>

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
            Choose a company DSA sheet below to view problem sets and download
            materials tailored for student success. More company sheets will be
            added in future updates.
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
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
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
          Designed to empower student placement prep and mock interview readiness.
          DSA sheets for NVIDIA, Apple, Meta, Atlassian, and other companies will be
          added in future updates.
        </div>
      </section>

      <Footer />
    </main>
  );
}