"use client";

import { Brain, Volume2 } from "lucide-react";

export default function AIAvatar() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <h2 className="mb-6 text-center text-lg font-semibold">
        AI Interviewer
      </h2>

      <div className="relative mx-auto flex h-56 w-56 items-center justify-center">

        {/* Outer Glow */}
        <div className="absolute h-56 w-56 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />

        {/* Ring */}
        <div className="absolute h-48 w-48 animate-spin rounded-full border border-cyan-400/30 border-dashed [animation-duration:18s]" />

        {/* Avatar */}
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_80px_rgba(34,211,238,.55)]">

          <Brain size={60} />

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">

        <div className="flex items-center justify-center gap-3">

          <Volume2 className="text-cyan-300" />

          <span className="font-medium text-cyan-300">

            Listening...

          </span>

        </div>

      </div>

    </div>
  );
}