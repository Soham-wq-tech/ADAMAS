"use client";

<<<<<<< HEAD
export default function QuestionCard() {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-white/[0.05] p-8 backdrop-blur-xl">

      <p className="text-sm uppercase tracking-widest text-cyan-300">

        Current Question

      </p>

      <h1 className="mt-5 text-3xl font-bold">

        Tell me about yourself.

      </h1>

      <p className="mt-5 text-slate-400 leading-7">

        Speak confidently.
        The AI interviewer is analysing your
        communication, confidence and technical knowledge.

      </p>

=======
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface QuestionCardProps {
  question?: string;
  onSendAnswer?: (answer: string) => void;
  isSending?: boolean;
}

export default function QuestionCard({
  question = "Tell me about yourself.",
  onSendAnswer,
  isSending = false,
}: QuestionCardProps) {
  const [textAnswer, setTextAnswer] = useState("");

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textAnswer.trim() || isSending) return;
    onSendAnswer?.(textAnswer);
    setTextAnswer("");
  };

  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-white/[0.05] p-8 backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
        Current Question
      </p>

      <h1 className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
        {question}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        Speak using the microphone or type your response below. The AI evaluates your communication, technical knowledge, and confidence.
      </p>

      {/* Optional Text Input Form */}
      {onSendAnswer && (
        <form onSubmit={handleTextSubmit} className="mt-6 flex items-center gap-3">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Or type your response here..."
            disabled={isSending}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <button
            type="submit"
            disabled={!textAnswer.trim() || isSending}
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Send</span>
          </button>
        </form>
      )}
>>>>>>> origin/main
    </div>
  );
}