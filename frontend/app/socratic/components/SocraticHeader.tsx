// frontend/app/socratic/components/SocraticHeader.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, LogOut } from "lucide-react";

export default function SocraticHeader() {
  const router = useRouter();

  const handleEndSession = () => {
    router.push("/socratic/analysis");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/70 backdrop-blur-xl shrink-0 z-20">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 transition hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-extrabold uppercase tracking-[0.15em] text-sm bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Socratic Room
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Topic: Two Sum Optimization
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Active Probing Session
        </span>

        {/* End Session Button */}
        <button
          onClick={handleEndSession}
          className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 cursor-pointer shadow-lg"
        >
          <LogOut size={14} />
          End Session & Analyze
        </button>
      </div>
    </header>
  );
}