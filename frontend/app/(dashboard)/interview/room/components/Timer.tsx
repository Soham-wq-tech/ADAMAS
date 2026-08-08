"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

interface TimerProps {
  initialMinutes?: number;
  onTimeUp?: () => void;
}

export default function Timer({
  initialMinutes = 20,
  onTimeUp,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-white/[0.05] p-6">
      <div className="flex items-center justify-center gap-2">
        <Clock3 className="text-cyan-400" />
        <span className="font-medium">Interview Timer</span>
      </div>

      <div className="mt-6 text-center text-5xl font-bold text-white">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>

      <div className="mt-3 text-center text-sm text-slate-400">
        Remaining Time
      </div>
    </div>
  );
}