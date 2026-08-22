"use client";

import { Target, HelpCircle, AlertCircle } from "lucide-react";

export default function ProbingPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-2 text-cyan-400 mb-4">
        <Target size={18} />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
          Current AI Probe Focus
        </h3>
      </div>

      <div className="space-y-3">
        <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <HelpCircle size={14} />
            <span>Target Concept</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Transitioning from O(N²) brute-force iteration to O(N) auxiliary lookup efficiency.
          </p>
        </div>

        <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <AlertCircle size={14} />
            <span>Active Question</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            How can we query whether a complementary number exists without scanning the array again?
          </p>
        </div>
      </div>
    </div>
  );
}