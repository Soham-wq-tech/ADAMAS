"use client";

import { useEffect } from "react";

import { useInterviewStore } from "@/store/interviewStore";

export default function useTimer() {
  const started = useInterviewStore(
    (state) => state.interviewStarted
  );

  const completed = useInterviewStore(
    (state) => state.interviewCompleted
  );

  const timeRemaining = useInterviewStore(
    (state) => state.timeRemaining
  );

  const setTimeRemaining = useInterviewStore(
    (state) => state.setTimeRemaining
  );

  const finishInterview = useInterviewStore(
    (state) => state.finishInterview
  );

  useEffect(() => {
    if (!started) return;

    if (completed) return;

    if (timeRemaining <= 0) {
      finishInterview();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    started,
    completed,
    timeRemaining,
    setTimeRemaining,
    finishInterview,
  ]);
}