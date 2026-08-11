export type InterviewStatus =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "completed";

export interface Score {
  communication: number;
  confidence: number;
  technical: number;
  problemSolving: number;
}

export interface TranscriptMessage {
  id: string;
  sender: "ai" | "user";
  message: string;
  timestamp: Date;
}

export interface InterviewState {
  status: InterviewStatus;

  currentQuestion: string;

  transcript: TranscriptMessage[];

  score: Score;

  timeRemaining: number;

  interviewStarted: boolean;

  interviewCompleted: boolean;
}