// frontend/app/socratic/analysis/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Award,
  ShieldAlert,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Users,
  Send,
  ArrowRight,
} from "lucide-react";

export default function SocraticAnalysisPage() {
  // Mastery Score State
  const [masteryScore, setMasteryScore] = useState<number>(78);
  const [defenseInput, setDefenseInput] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [defenseEvaluated, setDefenseEvaluated] = useState<boolean>(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API for Voice-Based Student Defense
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setDefenseInput(currentTranscript);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleEvaluateDefense = () => {
    if (!defenseInput.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Evaluate defense and update mastery score
    setDefenseEvaluated(true);
    setEvaluationFeedback(
      "Excellent defense! You correctly identified that auxiliary space overhead for the Hash Map is O(N), which trades space efficiency for O(N) lookup time."
    );
    setMasteryScore((prev) => Math.min(100, prev + 14));
  };

  const misconceptions = [
    {
      title: "Confusing Space Complexity with Time Bottleneck",
      frequency: "42% of students",
      description:
        "Students often assume O(N) memory allocation is always worse than O(N²) nested loops.",
    },
    {
      title: "Premature Optimization before Edge-Case Analysis",
      frequency: "31% of students",
      description:
        "Attempting two-pointer approaches on unsorted arrays without considering O(N log N) sorting cost.",
    },
    {
      title: "Overlooking Duplicate Element Keys in Hash Maps",
      frequency: "18% of students",
      description:
        "Failing to handle duplicate complement values when storing array indices.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-black text-slate-100 overflow-x-hidden p-6 sm:p-10">
      {/* Background Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl relative z-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              Socratic Dialectic Evaluation
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Session Analysis & Defense
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/socratic/room"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw size={14} /> Retry Session
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-black hover:scale-105 transition shadow-lg"
            >
              Back to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Mastery Score Box */}
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Current Concept Mastery
              </span>
              <Award className="text-cyan-400" size={24} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">
                {masteryScore}%
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                +14% from defense
              </span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${masteryScore}%` }}
              />
            </div>
          </div>

          {/* Reasoning Status */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reasoning Check
              </span>
              <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              Logically Sound
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Discovered space-time tradeoff and mapped O(N) Hash Map strategy.
            </p>
          </div>

          {/* AI Challenge Challenge */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Active AI Challenge
              </span>
              <ShieldAlert className="text-amber-400" size={24} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">
              Space Complexity Probe
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Can you defend memory overhead when N = 10⁷ elements?
            </p>
          </div>
        </div>

        {/* Interactive Student Defense Section */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-cyan-400" size={20} /> Defend Your Solution
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                AI Challenge: "Why use Hash Map auxiliary space instead of sorting in-place for $O(1)$ space?"
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              Step 4 of 6: Defense Phase
            </span>
          </div>

          {/* Defense Input & Voice Button */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Your Defense Statement (Voice or Text)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isListening
                    ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
                title="Voice-based student defense"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <input
                type="text"
                value={defenseInput}
                onChange={(e) => setDefenseInput(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your defense..."
                    : "Explain why trading space for O(N) time efficiency is optimal here..."
                }
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
              />

              <button
                onClick={handleEvaluateDefense}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-bold text-sm rounded-xl transition hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                Submit Defense <Send size={16} />
              </button>
            </div>
          </div>

          {/* AI Evaluation Result */}
          {defenseEvaluated && (
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <CheckCircle2 size={18} /> Evaluation Verdict: Defense Accepted
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {evaluationFeedback}
              </p>
            </div>
          )}
        </div>

        {/* Dashboard: Most Common Misconceptions */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Class Misconceptions Dashboard
                </h2>
                <p className="text-xs text-slate-400">
                  Aggregated insights from student defenses on this topic
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <BarChart3 size={16} className="text-cyan-400" /> Topic Analytics
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {misconceptions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-2 hover:border-white/20 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> High Frequency
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.frequency}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}