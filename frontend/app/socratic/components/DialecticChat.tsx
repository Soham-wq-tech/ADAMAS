"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  tag?: string;
}

interface DialecticChatProps {
  onConceptUnlocked?: (concept: string) => void;
}

export default function DialecticChat({ onConceptUnlocked }: DialecticChatProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to The Real Room Socratic Mode! Let's analyze the Two Sum problem together. How would you intuitively solve this manually?",
      tag: "Socratic Inquiry",
    },
  ]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Web Speech API for Speech-to-Text
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

  // Text-to-Speech (AI Voice)
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Voice Input (Mic)
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

  // Toggle AI Audio Output
  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    // Simulate Socratic AI Real-Time Voice & Text Response
    setTimeout(() => {
      const aiText = "Interesting approach! If you scan sequentially, what happens to time complexity as N grows? Could a Hash Map optimize this lookup?";
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        tag: "Guided Probe",
      };

      setMessages((prev) => [...prev, aiResponse]);
      speakText(aiText);

      if (onConceptUnlocked) {
        onConceptUnlocked("Time Complexity Bottlenecks");
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
      {/* Top Header Controls for Audio */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isSpeaking ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`} />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {isSpeaking ? "AI Speaking..." : "Interactive Dialogue"}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            isMuted
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {isMuted ? "Audio Muted" : "Audio On"}
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 border ${
                msg.sender === "user"
                  ? "bg-white/10 border-white/15 text-white"
                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              }`}
            >
              {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-semibold rounded-tr-none shadow-lg"
                  : "bg-black/60 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md"
              }`}
            >
              {msg.tag && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 mb-1.5 uppercase tracking-wider">
                  <Sparkles size={10} /> {msg.tag}
                </span>
              )}
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Integrated Speech-to-Text */}
      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-3">
        {/* Mic Toggle Button */}
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl border transition ${
            isListening
              ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
          }`}
          title={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Explain your thought process or speak into mic..."}
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
        />

        <button
          onClick={handleSend}
          className="p-3 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-bold rounded-xl transition hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}