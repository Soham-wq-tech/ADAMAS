"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AIAvatar from "./AIAvatar";
import QuestionCard from "./QuestionCard";
import Transcript from "./Transcript";
import CodePanel from "./CodePanel";
import ScorePanel from "./ScorePanel";

export default function InterviewLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="grid grid-cols-12 gap-6 p-6">

        <div className="col-span-2">
          <Sidebar />
        </div>

        <div className="col-span-7 space-y-6">
          <AIAvatar />

          <QuestionCard />

          <Transcript />

          <CodePanel />
        </div>

        <div className="col-span-3">
          <ScorePanel />
        </div>

      </div>
    </div>
  );
}