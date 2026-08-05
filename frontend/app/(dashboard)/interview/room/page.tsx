"use client";

import { useSearchParams } from "next/navigation";

import Background from "./components/Background";
import Header from "./components/Header";
import AIAvatar from "./components/AIAvatar";
import InterviewInfo from "./components/InterviewInfo";
import QuestionCard from "./components/QuestionCard";
import Transcript from "./components/Transcript";
import Timer from "./components/Timer";
import Notes from "./components/Notes";
import LiveFeedback from "./components/LiveFeedback";
import VoiceControls from "./components/VoiceControls";

export default function InterviewRoomPage() {
  const searchParams = useSearchParams();

  const company = searchParams.get("company") ?? "Google";
  const type = searchParams.get("type") ?? "Technical";
  const mood = searchParams.get("mood") ?? "Professional";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background */}
      <Background />

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] flex-col p-6">

        {/* Header */}
        <Header
          company={company}
          type={type}
          mood={mood}
        />

        {/* Main Grid */}
        <div className="mt-6 grid flex-1 grid-cols-12 gap-6">

          {/* Left Panel */}
          <div className="col-span-3 flex flex-col gap-6">
            <AIAvatar />

            <InterviewInfo
              company={company}
              type={type}
              mood={mood}
            />
          </div>

          {/* Center Panel */}
          <div className="col-span-6 flex flex-col gap-6">
            <QuestionCard />

            <Transcript />
          </div>

          {/* Right Panel */}
          <div className="col-span-3 flex flex-col gap-6">
            <Timer />

            <Notes />

            <LiveFeedback />
          </div>

        </div>

        {/* Bottom Controls */}
        <div className="mt-8 flex flex-col items-center gap-6">

          <VoiceControls />

          <button
            className="rounded-2xl border border-red-500/30
            bg-red-500/10 px-8 py-4 font-semibold
            text-red-300 transition
            hover:bg-red-500/20"
          >
            End Interview
          </button>

        </div>

      </div>

    </main>
  );
}