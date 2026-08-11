"use client";

import { useInterviewStore } from "@/store/interviewStore";

export default function useInterview() {
  const store = useInterviewStore();

  function startInterview() {
    store.startInterview();

    store.addTranscript(
      "ai",
      "Welcome to THE REAL ROOM. Let's begin the interview."
    );
  }

  function stopInterview() {
    store.finishInterview();
  }

  function askQuestion(question: string) {
    store.setQuestion(question);

    store.addTranscript("ai", question);
  }

  function answerQuestion(answer: string) {
    store.addTranscript("user", answer);
  }

  return {
    ...store,

    startInterview,

    stopInterview,

    askQuestion,

    answerQuestion,
  };
}