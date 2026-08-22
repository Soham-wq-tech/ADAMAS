"use client";

import { useState } from "react";
import SocraticHeader from "../components/SocraticHeader";
import ProbingPanel from "../components/ProbingPanel";
import ReasoningMap from "../components/ReasoningMap";
import SocraticPipeline from "../components/SocraticPipeline";

export default function SocraticRoomPage() {
  const [masteredConcepts, setMasteredConcepts] = useState<string[]>([
    "Problem Understanding",
  ]);
  const [sessionId, setSessionId] = useState<string | null>("session-binary-search-01");

  const handleConceptUnlocked = (concept: string) => {
    if (!masteredConcepts.includes(concept)) {
      setMasteredConcepts((prev) => [...prev, concept]);
    }
  };

  return (
    <main className="relative flex flex-col h-screen bg-black text-slate-100 overflow-hidden">
      {/* Ambient background blur elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-10 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]"
      />

      <SocraticHeader />

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
        {/* Left Side: Probing Focus & Mastery Map */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
          <ProbingPanel />
          <ReasoningMap uncoveredConcepts={masteredConcepts} />
        </div>

        {/* Right Side: Core Socratic Pipeline (Answer → Challenge → Defense → Evaluation) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <SocraticPipeline 
            sessionId={sessionId} 
            onConceptUnlocked={handleConceptUnlocked} 
          />
        </div>
      </div>
    </main>
  );
}