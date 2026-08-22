"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SocraticLearningPage() {
  const router = useRouter();
  
  // Workflow states: 1 = Enter Answer, 2 = Socratic Challenge Defense, 3 = Results & Mastery Score
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [initialAnswer, setInitialAnswer] = useState("");
  const [socraticChallenge, setSocraticChallenge] = useState("");
  const [defense, setDefense] = useState("");
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Submit initial answer to get the Socratic Challenge
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !initialAnswer.trim()) return;

    setLoading(true);
    try {
      // Replace with your actual backend Flask API endpoint
      const response = await fetch("http://localhost:5000/api/learning/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, answer: initialAnswer }),
      });
      const data = await response.json();
      
      if (data.socratic_challenge) {
        setSocraticChallenge(data.socratic_challenge);
        setStep(2);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
      // Fallback mock for testing UI if backend isn't running yet
      setSocraticChallenge("Merge Sort also divides the array in half. Why is Merge Sort O(n log n) while Binary Search is O(log n)?");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit student defense to evaluate mastery
  const handleDefenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defense.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/learning/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge: socraticChallenge, defense }),
      });
      const data = await response.json();
      
      // Parse evaluation response
      const evalData = typeof data.evaluation === "string" ? JSON.parse(data.evaluation) : data.evaluation;
      setEvaluation(evalData);
      setStep(3);
    } catch (error) {
      console.error("Error evaluating defense:", error);
      // Fallback mock evaluation
      setEvaluation({
        score: 85,
        feedback: "Good explanation of how Merge Sort handles all elements during the combination phase, whereas Binary Search discards half the dataset instantly."
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setStep(1);
    setTopic("");
    setInitialAnswer("");
    setSocraticChallenge("");
    setDefense("");
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">R</div>
          <span className="font-bold text-xl tracking-wide">REAL ROOM <span className="text-indigo-400 text-xs px-2 py-0.5 bg-indigo-950 border border-indigo-800 rounded-full ml-2">Learning Mode</span></span>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          Back to Home
        </button>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          {/* STEP 1: Topic & Initial Answer */}
          {step === 1 && (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Socratic Concept Check</h2>
                <p className="text-slate-400 text-sm">Enter a topic and your explanation. The AI will challenge your reasoning rather than just giving you a grade.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject / Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Binary Search Time Complexity" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Initial Answer / Explanation</label>
                <textarea 
                  rows={4}
                  value={initialAnswer}
                  onChange={(e) => setInitialAnswer(e.target.value)}
                  placeholder="e.g. Binary Search is O(log n) because we divide the search space in half..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? "Analyzing Reasoning..." : "Submit for Socratic Challenge"}
              </button>
            </form>
          )}

          {/* STEP 2: The Socratic Challenge & Defense */}
          {step === 2 && (
            <form onSubmit={handleDefenseSubmit} className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">AI Socratic Interrogation</span>
                <h2 className="text-xl font-bold text-white mt-1">Defend Your Knowledge</h2>
              </div>

              <div className="bg-slate-950 border border-indigo-900/50 rounded-xl p-4 text-indigo-200">
                <p className="text-xs text-indigo-400 mb-1 font-semibold">AI Counter-Question:</p>
                <p className="text-sm leading-relaxed">{socraticChallenge}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Defense / Response</label>
                <textarea 
                  rows={4}
                  value={defense}
                  onChange={(e) => setDefense(e.target.value)}
                  placeholder="Explain why your logic stands or address the counter-question..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? "Evaluating Defense..." : "Submit Defense"}
              </button>
            </form>
          )}

          {/* STEP 3: Results & Mastery Score */}
          {step === 3 && evaluation && (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Evaluation Complete</span>
                <h2 className="text-2xl font-bold text-white mt-1">Mastery Assessment</h2>
              </div>

              <div className="inline-flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full">
                <span className="text-sm text-slate-400 mb-1">Concept Mastery Score</span>
                <span className="text-5xl font-extrabold text-indigo-400">{evaluation.score}%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left">
                <p className="text-xs text-slate-400 mb-1 font-semibold">Personalized Feedback:</p>
                <p className="text-sm text-slate-300 leading-relaxed">{evaluation.feedback}</p>
              </div>

              <button 
                onClick={resetSession}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition"
              >
                Test Another Concept
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}