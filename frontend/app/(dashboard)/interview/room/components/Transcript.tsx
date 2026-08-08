"use client";

import { useEffect, useRef } from "react";

export interface Message {
  sender: "ai" | "user";
  content: string;
}

interface TranscriptProps {
  messages?: Message[];
  transcript?: string;
  isListening?: boolean;
}

export default function Transcript({
  messages = [],
  transcript = "",
  isListening = false,
}: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  return (
    <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl max-h-[420px]">
      <h2 className="mb-4 text-xl font-semibold text-white">Conversation</h2>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                msg.sender === "ai" ? "text-cyan-300" : "text-blue-300"
              }`}
            >
              {msg.sender === "ai" ? "🤖 AI Interviewer" : "👤 You"}
            </p>

            <div
              className={`mt-1.5 rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === "ai"
                  ? "border border-cyan-500/20 bg-cyan-500/10 text-slate-200"
                  : "border border-blue-500/20 bg-blue-500/10 text-slate-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Live Speech Feedback */}
        {isListening && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              👤 You (Speaking...)
            </p>
            <div className="mt-1.5 min-h-[60px] rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm italic text-slate-300">
              {transcript || (
                <span className="font-normal text-slate-500">
                  Speak now, your speech will appear here...
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              🎤 Listening active...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}