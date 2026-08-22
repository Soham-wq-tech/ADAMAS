// frontend/app/components/landing/HowItWorks.tsx
"use client";

import { useState } from "react";
import {
  Mic,
  Cpu,
  BarChart2,
  HelpCircle,
  Network,
  Sparkles,
} from "lucide-react";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"interview" | "socratic">(
    "interview"
  );

  const interviewSteps = [
    {
      step: "01",
      icon: <Mic className="h-6 w-6 text-cyan-400" />,
      title: "Voice & Code Input",
      description:
        "Speak your thoughts naturally while writing solutions in our real-time IDE. The AI processes your speech and code continuously.",
    },
    {
      step: "02",
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "Adaptive AI Pushback",
      description:
        "The interviewer listens, detects inefficiencies, and actively challenges your assumptions, mimicking strict technical interviewers.",
    },
    {
      step: "03",
      icon: <BarChart2 className="h-6 w-6 text-cyan-400" />,
      title: "Comprehensive Report",
      description:
        "Receive actionable feedback on time complexity, communication clarity, problem-solving speed, and areas for improvement.",
    },
  ];

  const socraticSteps = [
    {
      step: "01",
      icon: <HelpCircle className="h-6 w-6 text-sky-400" />,
      title: "Targeted Dialectic Probing",
      description:
        "Instead of giving away the answer, the AI asks targeted conceptual questions to guide you toward discovering the optimal approach.",
    },
    {
      step: "02",
      icon: <Network className="h-6 w-6 text-sky-400" />,
      title: "Concept Progression Mapping",
      description:
        "Track your mental leaps on an interactive knowledge graph that visually unlocks sub-concepts as you demonstrate understanding.",
    },
    {
      step: "03",
      icon: <Sparkles className="h-6 w-6 text-sky-400" />,
      title: "Progressive Hint Layers",
      description:
        "Get stuck? Unlock multi-tiered hints ranging from high-level conceptual nudges to algorithmic breakdowns without ruining the challenge.",
    },
  ];

  const currentSteps =
    activeTab === "interview" ? interviewSteps : socraticSteps;

  return (
    <section id="how-it-works" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
          Step-by-Step Workflow
        </span>

        <h2 className="mt-6 text-4xl font-bold text-white">How It Works</h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Switch between our dual pathways to see how each environment helps you conquer tech interviews.
        </p>

        {/* Tab Selector */}
        <div className="mt-8 inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("interview")}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === "interview"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            The Real Room (Interview)
          </button>
          <button
            onClick={() => setActiveTab("socratic")}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === "socratic"
                ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Socratic Studio (Tutor)
          </button>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {currentSteps.map((s) => (
          <div
            key={s.step}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/[0.08]"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                {s.icon}
              </div>
              <span className="text-3xl font-black text-white/20 group-hover:text-cyan-400/30 transition">
                {s.step}
              </span>
            </div>

            <h3 className="mt-6 text-xl font-bold text-white group-hover:text-cyan-300 transition">
              {s.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}