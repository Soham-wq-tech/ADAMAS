"use client";

import { useState } from "react";
import { Lightbulb, ChevronRight, Lock, Sparkles } from "lucide-react";

interface Hint {
  id: number;
  level: string;
  text: string;
}

const HINTS_DATA: Hint[] = [
  {
    id: 1,
    level: "Nudge 1 (Conceptual)",
    text: "Think about how we can avoid checking duplicate elements by using a complementary structure.",
  },
  {
    id: 2,
    level: "Nudge 2 (Algorithmic)",
    text: "For every element `x`, can we check if `target - x` has already been stored?",
  },
  {
    id: 3,
    level: "Nudge 3 (Implementation)",
    text: "A Hash Map allows us to perform constant time O(1) lookups for `target - x` as we iterate through the array.",
  },
];

export default function ProgressiveHints() {
  const [unlockedCount, setUnlockedCount] = useState<number>(1);

  const handleRevealNext = () => {
    if (unlockedCount < HINTS_DATA.length) {
      setUnlockedCount((prev) => prev + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Progressive Hints System
          </h3>
        </div>

        {unlockedCount < HINTS_DATA.length && (
          <button
            onClick={handleRevealNext}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30"
          >
            <span>Reveal Next Hint</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {HINTS_DATA.map((hint, idx) => {
          const isUnlocked = idx < unlockedCount;

          return (
            <div
              key={hint.id}
              className={`p-3.5 rounded-xl border text-xs transition-all ${
                isUnlocked
                  ? "bg-slate-900/90 border-amber-500/30 text-slate-200"
                  : "bg-slate-950/40 border-slate-800 text-slate-600 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400/90">
                  {hint.level}
                </span>
                {isUnlocked ? (
                  <Lightbulb size={14} className="text-amber-400" />
                ) : (
                  <Lock size={14} className="text-slate-600" />
                )}
              </div>

              <p className="leading-relaxed">
                {isUnlocked
                  ? hint.text
                  : "Locked. Click 'Reveal Next Hint' above when you need assistance."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}