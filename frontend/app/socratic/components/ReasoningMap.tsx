"use client";

import { Network, CheckCircle2, Circle } from "lucide-react";

interface ReasoningMapProps {
  uncoveredConcepts?: string[];
}

const CONCEPTS = [
  "Problem Understanding",
  "Time Complexity Bottlenecks",
  "Hash Map Lookup Efficiency",
  "Edge Case Validation",
];

export default function ReasoningMap({ uncoveredConcepts = ["Problem Understanding"] }: ReasoningMapProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl flex-1">
      <div className="flex items-center gap-2 text-slate-400 mb-4">
        <Network size={18} />
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
          Concept Progression Graph
        </h3>
      </div>

      <div className="space-y-2.5">
        {CONCEPTS.map((concept) => {
          const isUnlocked = uncoveredConcepts.includes(concept);
          return (
            <div
              key={concept}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all ${
                isUnlocked
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-200"
                  : "bg-black/40 border-white/10 text-slate-500"
              }`}
            >
              <span className="font-medium">{concept}</span>
              {isUnlocked ? (
                <CheckCircle2 size={16} className="text-cyan-400" />
              ) : (
                <Circle size={16} className="text-slate-700" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}