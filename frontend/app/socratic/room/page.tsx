"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SocraticHeader from "../components/SocraticHeader";
import ProbingPanel from "../components/ProbingPanel";
import ReasoningMap from "../components/ReasoningMap";
import DialecticChat from "../components/DialecticChat";

type Stage =
  | "answer"
  | "challenge"
  | "defense"
  | "evaluation"
  | "mastery";

export default function SocraticRoomPage() {
  const router = useRouter();
  
  const [stage, setStage] = useState<Stage>("answer");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("Algorithmic Problem Solving");
  const [problemStatement, setProblemStatement] = useState<string>("Loading problem statement...");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [masteredConcepts, setMasteredConcepts] = useState<string[]>([]);
  const [masteryScore, setMasteryScore] = useState<number>(0);
  const [lastAnswer, setLastAnswer] = useState<string>("");
  const [currentChallenge, setCurrentChallenge] = useState<string>("");
  const [loadingSession, setLoadingSession] = useState<boolean>(true);

  // Initialize session dynamically on mount with fallback for 401/unauthenticated states
  useEffect(() => {
    async function initSession() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const res = await fetch(`${API_BASE}/api/socratic/start`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            topic: "Binary Search Optimization",
            problem_statement: "Determine the conditions under which binary search can be applied to non-monotonic or rotated sorted arrays.",
            concepts: ["Range Reduction", "Midpoint Invariant", "Monotonicity"]
          })
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        const activeSession = data.session || data;
        
        setSessionId(activeSession.id || "mock-session-123");
        setTopic(activeSession.topic || "Binary Search Optimization");
        setProblemStatement(activeSession.problem_statement || "Determine the conditions under which binary search can be applied to non-monotonic or rotated sorted arrays.");
        setConcepts(activeSession.concepts || ["Range Reduction", "Midpoint Invariant", "Monotonicity"]);
        setMasteredConcepts(activeSession.concepts_unlocked || ["Range Reduction"]);
        setStage(activeSession.stage || "answer");
        setCurrentChallenge(activeSession.current_challenge || "");
        setMasteryScore(activeSession.mastery_score || 0);
      } catch (err) {
        console.warn("Backend session initialization failed or unauthenticated. Falling back to local offline mode:", err);
        
        // Fallback local session data so the UI works seamlessly without backend running/auth
        setSessionId("fallback-session-local");
        setTopic("Binary Search Optimization");
        setProblemStatement("Determine the conditions under which binary search can be applied to non-monotonic or rotated sorted arrays.");
        setConcepts(["Range Reduction", "Midpoint Invariant", "Monotonicity"]);
        setMasteredConcepts(["Range Reduction"]);
        setStage("answer");
      } finally {
        setLoadingSession(false);
      }
    }
    initSession();
  }, []);

  const handleConceptUnlocked = (concept: string) => {
    if (!masteredConcepts.includes(concept)) {
      setMasteredConcepts((prev) => [...prev, concept]);
    }
  };

  if (loadingSession || !sessionId) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-black text-slate-400">
        <div className="animate-pulse text-sm font-medium">Initializing Socratic Dialectic Room...</div>
      </main>
    );
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-black text-slate-100">
      {/* Background Ambient Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-10 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-[90px]"
      />

      {/* Header component with End Interview wired to Dashboard */}
      <SocraticHeader 
        topic={topic} 
        problemStatement={problemStatement} 
        onEnd={() => router.push("/socratic/dashboard")}
      />

      {/* Stage Indicator Bar */}
      <div className="relative z-25 flex items-center justify-center gap-2 sm:gap-4 border-b border-white/10 px-6 py-2.5 bg-black/60 backdrop-blur-md text-xs sm:text-sm shrink-0">
        <StageItem
          number="1"
          label="Answer"
          active={stage === "answer"}
          completed={["challenge", "defense", "evaluation", "mastery"].includes(stage)}
        />
        <div className="h-px w-6 sm:w-10 bg-white/15" />

        <StageItem
          number="2"
          label="Challenge"
          active={stage === "challenge"}
          completed={["defense", "evaluation", "mastery"].includes(stage)}
        />
        <div className="h-px w-6 sm:w-10 bg-white/15" />

        <StageItem
          number="3"
          label="Defense"
          active={stage === "defense"}
          completed={["evaluation", "mastery"].includes(stage)}
        />
        <div className="h-px w-6 sm:w-10 bg-white/15" />

        <StageItem
          number="4"
          label="Evaluation"
          active={stage === "evaluation"}
          completed={stage === "mastery"}
        />
        <div className="h-px w-6 sm:w-10 bg-white/15" />

        <StageItem
          number="5"
          label="Mastery"
          active={stage === "mastery"}
          completed={false}
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-1 flex-col gap-5 overflow-hidden p-5 lg:flex-row min-h-0">
        {/* LEFT COLUMN: Probing Panel & Concept Map */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[360px] overflow-y-auto pr-1">
          <ProbingPanel 
            concepts={concepts} 
            stage={stage} 
            masteryScore={masteryScore} 
          />
          <ReasoningMap 
            uncoveredConcepts={masteredConcepts} 
            challenge={currentChallenge} 
            lastAnswer={lastAnswer} 
            concepts={concepts}
          />
        </div>

        {/* RIGHT COLUMN: Dialectic Chat Pipeline */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DialecticChat
            sessionId={sessionId}
            stage={stage}
            onStageChange={setStage}
            onConceptUnlocked={handleConceptUnlocked}
            onMasteryUpdate={setMasteryScore}
            onLastAnswerUpdate={setLastAnswer}
            onCurrentChallengeUpdate={setCurrentChallenge}
          />
        </div>
      </div>
    </main>
  );
}

function StageItem({
  number,
  label,
  active,
  completed,
}: {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 font-medium ${
        active
          ? "text-cyan-400 font-bold scale-105"
          : completed
          ? "text-slate-300"
          : "text-slate-600"
      }`}
    >
      <span
        className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-xs ${
          active
            ? "border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-sm shadow-cyan-400/30"
            : completed
            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
            : "border-slate-700 bg-black/40 text-slate-600"
        }`}
      >
        {completed ? "✓" : number}
      </span>

      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}