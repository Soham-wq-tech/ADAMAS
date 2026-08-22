"use client";

import { Target, HelpCircle, AlertCircle, Award } from "lucide-react";

interface ProbingPanelProps {
  concepts?: string[];
  stage?: string;
  masteryScore?: number;
}

export default function ProbingPanel({ 
  concepts = [], 
  stage = "answer", 
  masteryScore = 0.0 
}: ProbingPanelProps) {
  const currentConcept = concepts.length > 0 ? concepts[0] : "Algorithmic Complexity & Logic";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <Target size={18} />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Current AI Probe Focus
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
          Stage: {stage}
        </span>
      </div>

      <div className="space-y-3">
        {/* Mastery Score Progress Bar */}
        <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award size={14} />
              <span>Mastery Progress</span>
            </div>
            <span className="text-slate-200">{(masteryScore * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-500" 
              style={{ width: `${Math.max(5, masteryScore * 100)}%` }} 
            />
          </div>
        </div>

        {/* Target Concept */}
        <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <HelpCircle size={14} />
            <span>Target Concept</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {currentConcept}
          </p>
        </div>

        {/* All Available Concepts Tag Cloud */}
        {concepts.length > 1 && (
          <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold block mb-2">Session Pillars:</span>
            <div className="flex flex-wrap gap-1.5">
              {concepts.map((c, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 text-slate-300 text-[11px] px-2 py-0.5 rounded-md">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}