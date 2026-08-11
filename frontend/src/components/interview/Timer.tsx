"use client";

import useTimer from "@/hooks/useTimer";
import { useInterviewStore } from "@/store/interviewStore";
import { Clock3 } from "lucide-react";

export default function Timer() {
  useTimer();

  const timeRemaining = useInterviewStore(
    (state) => state.timeRemaining
  );

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  let colour =
    "text-green-400 border-green-400/30 bg-green-500/10";

  if (timeRemaining <= 300) {
    colour =
      "text-orange-400 border-orange-400/30 bg-orange-500/10";
  }

  if (timeRemaining <= 60) {
    colour =
      "text-red-400 border-red-400/30 bg-red-500/10";
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold ${colour}`}
    >
      <Clock3 size={18} />

      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}