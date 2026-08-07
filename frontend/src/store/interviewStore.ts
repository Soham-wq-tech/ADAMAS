import { create } from "zustand";

import {
  DEFAULT_QUESTION,
  DEFAULT_SCORE,
  INTERVIEW_DURATION,
} from "@/lib/constants";

import {
  InterviewStatus,
  TranscriptMessage,
  Score,
} from "@/types/interview";

interface InterviewStore {
  status: InterviewStatus;

  currentQuestion: string;

  transcript: TranscriptMessage[];

  score: Score;

  timeRemaining: number;

  interviewStarted: boolean;

  interviewCompleted: boolean;

  setStatus: (status: InterviewStatus) => void;

  setQuestion: (question: string) => void;

  addTranscript: (
    sender: "ai" | "user",
    message: string
  ) => void;

  clearTranscript: () => void;

  updateScore: (score: Partial<Score>) => void;

  setTimeRemaining: (time: number) => void;

  startInterview: () => void;

  finishInterview: () => void;

  resetInterview: () => void;
}

export const useInterviewStore =
  create<InterviewStore>((set) => ({
    status: "idle",

    currentQuestion: DEFAULT_QUESTION,

    transcript: [],

    score: DEFAULT_SCORE,

    timeRemaining: INTERVIEW_DURATION,

    interviewStarted: false,

    interviewCompleted: false,

    setStatus: (status) =>
      set({
        status,
      }),

    setQuestion: (question) =>
      set({
        currentQuestion: question,
      }),

    addTranscript: (sender, message) =>
      set((state) => ({
        transcript: [
          ...state.transcript,
          {
            id: crypto.randomUUID(),
            sender,
            message,
            timestamp: new Date(),
          },
        ],
      })),

    clearTranscript: () =>
      set({
        transcript: [],
      }),

    updateScore: (score) =>
      set((state) => ({
        score: {
          ...state.score,
          ...score,
        },
      })),

    setTimeRemaining: (time) =>
      set({
        timeRemaining: time,
      }),

    startInterview: () =>
      set({
        interviewStarted: true,
        interviewCompleted: false,
        status: "listening",
      }),

    finishInterview: () =>
      set({
        interviewCompleted: true,
        status: "completed",
      }),

    resetInterview: () =>
      set({
        status: "idle",

        interviewStarted: false,

        interviewCompleted: false,

        currentQuestion: DEFAULT_QUESTION,

        transcript: [],

        score: DEFAULT_SCORE,

        timeRemaining: INTERVIEW_DURATION,
      }),
  }));