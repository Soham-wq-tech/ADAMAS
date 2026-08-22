"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-20 pb-12">
      {/* Badge */}
      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs text-cyan-300 mb-6">
        The Future of Technical Interview Preparation
      </span>

      {/* Main Title */}
      <h1 className="text-5xl font-extrabold text-white tracking-tight sm:text-6xl">
        THE <span className="text-cyan-400">REAL ROOM</span>
      </h1>

      <p className="mt-4 max-w-2xl text-base text-slate-400">
        Master your placement interviews with an AI that listens, adapts, and
        pushes back—or build conceptual depth in Socratic Mode.
      </p>

      {/* Dual Entry Buttons */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Entrance 1: Interview Room */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-start gap-3 transition-all hover:border-cyan-600/50 hover:bg-black/40">
          <h3 className="text-xl font-semibold text-white">Interview Room</h3>
          <p className="text-sm text-slate-400 text-left">
            Strict timing, high pressure, comprehensive scorecards. Simulate real interview conditions.
          </p>
          <Link
            href="/interview/room"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 transition w-full justify-center"
          >
            <span>Enter The Room</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Entrance 2: Socratic Mode (NEW) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-start gap-3 transition-all hover:border-indigo-600/50 hover:bg-black/40">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            <h3 className="text-xl font-semibold text-white">Socratic Mode</h3>
          </div>
          <p className="text-sm text-slate-400 text-left">
            Interactive, non-linear learning. AI probes and hints guide you toward conceptual mastery.
          </p>
          <Link
            href="/socratic/room"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition w-full justify-center"
          >
            <span>Start Learning</span>
            <Sparkles size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}