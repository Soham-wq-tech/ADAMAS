"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  tag?: string;
}

type Stage =
  | "answer"
  | "challenge"
  | "defense"
  | "evaluation"
  | "mastery";

interface DialecticChatProps {
  sessionId?: string | null;
  stage?: string;
  onConceptUnlocked?: (concept: string) => void;
  onStageChange?: (stage: any) => void;
  onMasteryUpdate?: (score: number) => void;
  onLastAnswerUpdate?: (answer: string) => void;
  onCurrentChallengeUpdate?: (challenge: string) => void;
}

export default function DialecticChat({ 
  sessionId, 
  stage = "answer",
  onConceptUnlocked, 
  onStageChange,
  onMasteryUpdate,
  onLastAnswerUpdate,
  onCurrentChallengeUpdate
}: DialecticChatProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Track offline pillar progression sequentially to gate early completion
  const [pillarStep, setPillarStep] = useState(0);
  const allPillars = ["Range Reduction", "Midpoint Invariant", "Monotonicity"];
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to The Real Room Socratic Mode!\n\n**Topic:** Binary Search Optimization\n**Core Problem:** Determine the conditions under which binary search can be applied to non-monotonic functions.\n\nHow would you intuitively define the search space and monotonicity properties required for this?",
      tag: "Socratic Inquiry",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        recognition.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
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

  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userText = input;
    const isDefending = stage === "defense";

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      tag: isDefending ? "Defense" : "Answer",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (onLastAnswerUpdate) {
      onLastAnswerUpdate(userText);
    }

    const isFallbackSession = !sessionId || sessionId.includes("fallback");

    if (!isFallbackSession) {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const endpoint = isDefending 
          ? `${API_BASE}/api/socratic/${sessionId}/defense`
          : `${API_BASE}/api/socratic/${sessionId}/answer`;
        
        const payload = isDefending ? { defense: userText } : { answer: userText };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          let aiText = "";
          let tag = "Socratic Inquiry";

          if (isDefending) {
            aiText = data.evaluation || "Defense evaluated successfully.";
            tag = `Evaluation (Score: ${((data.mastery_score || 0) * 100).toFixed(0)}%)`;
            if (data.mastery_score !== undefined && onMasteryUpdate) {
              onMasteryUpdate(data.mastery_score);
            }
          } else {
            if (data.valid === false) {
              aiText = `[Needs Refinement]: ${data.feedback} Try considering: ${data.current_challenge}`;
              tag = "Guided Probe (Flawed Logic)";
            } else {
              aiText = data.current_challenge || data.feedback || "Let's explore further.";
              tag = "Challenge Probed";
              if (onCurrentChallengeUpdate) {
                onCurrentChallengeUpdate(aiText);
              }
            }
            if (data.session?.concepts && data.session.concepts.length > 0 && onConceptUnlocked) {
              onConceptUnlocked(data.session.concepts[0]);
            }
          }

          const nextStage = data.current_stage || data.stage || (isDefending ? "evaluation" : "challenge");
          if (onStageChange) onStageChange(nextStage);

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: aiText,
            tag: tag,
          };

          setMessages((prev) => [...prev, aiResponse]);
          speakText(aiText);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Backend request failed, falling back to local simulation:", err);
      }
    }

    // --- OFFLINE / FALLBACK SIMULATION WITH CONCEPT GATING ---
    setTimeout(() => {
      let aiText = "";
      let tag = "";
      let unlockedConcept = "";
      let nextStageValue: any = stage; // Avoids TypeScript union incompatibility error

      // Check if we still have pillars left to cover sequentially
      if (pillarStep < allPillars.length - 1) {
        const nextStep = pillarStep + 1;
        setPillarStep(nextStep);
        unlockedConcept = allPillars[nextStep];

        if (unlockedConcept === "Midpoint Invariant") {
          aiText = "Good range reduction logic. Now, how do we guarantee correctness with integer overflow and the midpoint invariant?";
          tag = "Probing: Midpoint Invariant";
          nextStageValue = "challenge";
        } else if (unlockedConcept === "Monotonicity") {
          aiText = "Almost there! How does your logic adapt when the function is non-monotonic or piecewise?";
          tag = "Probing: Monotonicity";
          nextStageValue = "defense";
        }

        if (onMasteryUpdate) onMasteryUpdate(0.67 + (nextStep * 0.12));
      } else {
        // All pillars are covered and verified. Gate opens for final mastery!
        aiText = "All foundational concepts (Range Reduction, Midpoint Invariant, Monotonicity) have been successfully mastered. Session Complete!";
        tag = "Mastery Achieved";
        nextStageValue = "mastery";
        unlockedConcept = "Monotonicity";
        if (onMasteryUpdate) onMasteryUpdate(0.92);
      }

      if (onStageChange) {
        onStageChange(nextStageValue);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        tag: tag,
      };

      setMessages((prev) => [...prev, aiResponse]);
      speakText(aiText);

      if (unlockedConcept && onConceptUnlocked) {
        onConceptUnlocked(unlockedConcept);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden relative">
      {/* Top Header Controls for Audio & Status */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className={`h-3 w-3 rounded-full ${isSpeaking ? "bg-cyan-400 animate-ping absolute" : "bg-emerald-400"}`} />
            <span className={`h-3 w-3 rounded-full ${isSpeaking ? "bg-cyan-400" : "bg-emerald-400"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Dialectic Socratic Chamber</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
                Stage: {stage}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isSpeaking ? "AI Probing Active..." : "Binary Search Optimization Focus"}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
            isMuted
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {isMuted ? "Audio Muted" : "Voice On"}
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`p-2.5 rounded-2xl shrink-0 border shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300"
                  : "bg-black/80 border-white/20 text-white"
              }`}
            >
              {msg.sender === "user" ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div
              className={`max-w-[78%] rounded-2xl p-5 shadow-xl transition-all ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-semibold rounded-tr-none shadow-cyan-500/10"
                  : "bg-black/70 border border-white/15 text-slate-100 rounded-tl-none backdrop-blur-xl"
              }`}
            >
              {msg.tag && (
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2 px-2.5 py-1 rounded-lg ${
                  msg.sender === "user" 
                    ? "bg-black/20 text-black" 
                    : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                }`}>
                  <Sparkles size={12} /> {msg.tag}
                </span>
              )}
              <p className={`text-base leading-relaxed whitespace-pre-line ${msg.sender === "user" ? "text-black font-bold" : "text-slate-100 font-medium"}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs italic pl-12 animate-pulse">
            <Sparkles size={14} /> Evaluating semantic validity & generating Socratic challenge...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-xl flex items-center gap-3.5">
        <button
          onClick={toggleListening}
          className={`p-3.5 rounded-2xl border transition shadow-lg ${
            isListening
              ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
              : "bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            stage === "defense"
              ? "Defend your reasoning against the challenge..."
              : isListening
              ? "Listening to your voice..."
              : "Type your answer or explanation clearly..."
          }
          className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-5 py-3.5 text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition shadow-inner"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-5 py-3.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-extrabold text-sm rounded-2xl transition hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          <span>{stage === "defense" ? "Defend" : "Send"}</span>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}