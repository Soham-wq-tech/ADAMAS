"use client";

import { Mic, MicOff } from "lucide-react";
import { useState } from "react";

export default function VoiceControls() {
  const [listening, setListening] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">

      <button
        onClick={() => setListening(!listening)}
        className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300
        ${
          listening
            ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-[0_0_70px_rgba(239,68,68,.6)] scale-105"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_60px_rgba(34,211,238,.45)] hover:scale-105"
        }`}
      >
        {listening ? <MicOff size={40} /> : <Mic size={40} />}

        {listening && (
          <>
            <span className="absolute h-full w-full animate-ping rounded-full border border-red-400" />
            <span className="absolute h-full w-full animate-pulse rounded-full border border-red-300" />
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-lg font-semibold">
          {listening ? "Listening..." : "Click to Speak"}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {listening
            ? "AI is listening to your response."
            : "Press the microphone to answer."}
        </p>
      </div>

    </div>
  );
}