"use client";

import { Sparkles } from "lucide-react";
import { useInterviewStore } from "@/store/interviewStore";

export default function QuestionCard() {
  const question = useInterviewStore(
    (state) => state.currentQuestion
  );

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-8 shadow-xl shadow-cyan-500/10">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="text-cyan-400" />

        <h2 className="text-xl font-bold">
          Current Interview Question
        </h2>
      </div>

      <p className="text-lg leading-8 text-gray-300">
        {question}
      </p>
    </div>
  );
}