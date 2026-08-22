"use client";

import { Network, CheckCircle2, Circle, MessageSquare, Lightbulb } from "lucide-react";

interface ReasoningMapProps {
  uncoveredConcepts?: string[];
  challenge?: string;
  lastAnswer?: string;
  concepts?: string[];
}

export default function ReasoningMap({ 
  uncoveredConcepts = ["Problem Understanding"],
  challenge,
  lastAnswer,
  concepts = [
    "Problem Understanding",
    "Time Complexity Bottlenecks",
    "Hash Map Lookup Efficiency",
    "Edge Case Validation",
  ]
}: ReasoningMapProps) {
  const unlockedCount = concepts.filter((c) => uncoveredConcepts.includes(c)).length;
  const progressPercentage = concepts.length > 0 ? Math.round((unlockedCount / concepts.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between gap-5">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Network size={18} />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Concept Mastery Tree
            </h3>
          </div>
          <span className="text-xs font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            {progressPercentage}% Unlocked
          </span>
        </div>

        {/* Concept Nodes List */}
        <div className="space-y-3">
          {concepts.map((concept, index) => {
            const isUnlocked = uncoveredConcepts.includes(concept);
            return (
              <div
                key={concept}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                  isUnlocked
                    ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/40 text-cyan-200 shadow-lg shadow-cyan-500/5"
                    : "bg-black/50 border-white/10 text-slate-500 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${isUnlocked ? "text-cyan-400" : "text-slate-600"}`}>
                    0{index + 1}
                  </span>
                  <span className={`text-xs font-semibold ${isUnlocked ? "text-white" : "text-slate-400"}`}>
                    {concept}
                  </span>
                </div>
                {isUnlocked ? (
                  <CheckCircle2 size={16} className="text-cyan-400 animate-in zoom-in duration-200" />
                ) : (
                  <Circle size={16} className="text-slate-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Active Reasoning Trail (Latest Answer & Active Challenge) */}
      {(lastAnswer || challenge) && (
        <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
          {lastAnswer && (
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                <MessageSquare size={12} className="text-cyan-400" />
                <span>Latest User Answer</span>
              </div>
              <p className="text-slate-300 line-clamp-2 font-medium">{lastAnswer}</p>
            </div>
          )}
          {challenge && (
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                <Lightbulb size={12} className="text-amber-400" />
                <span>Active Challenge</span>
              </div>
              <p className="text-slate-300 line-clamp-2 font-medium">{challenge}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Progress Status</span>
        <span className="text-slate-300">{unlockedCount} of {concepts.length} Concepts Mastered</span>
      </div>
    </div>
  );
}