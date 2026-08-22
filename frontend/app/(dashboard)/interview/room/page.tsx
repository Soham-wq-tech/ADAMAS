"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import Background from "./components/Background";
import AIAvatar from "./components/AIAvatar";
import InterviewInfo from "./components/InterviewInfo";
import Timer from "./components/Timer";
import Notes from "./components/Notes";
import VoiceControls from "./components/VoiceControls";
import WebcamPanel from "./components/WebcamPanel";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

// NOTE: The old <Header /> component is intentionally no longer used on this
// page. It appeared to be the source of both extra "End Interview" buttons
// (one duplicated at the top, one larger one lower on the page). The top
// bar below is now built inline so there is exactly one End Interview
// button, one logo, and one row of badges — all controlled from this file.

export interface Message {
  sender: "ai" | "user";
  content: string;
}

interface RawSessionMessage {
  sender?: string;
  role?: string;
  content?: string | { content?: string; text?: string };
  text?: string;
}

// Speed (ms) between each character appearing in the AI's typewriter text.
// Higher = slower.
const TYPEWRITER_SPEED_MS = 45;

// Small delay before speech synthesis starts. Without this, most browsers
// (Chrome in particular) will clip the very first letter/word of the
// utterance when speak() is called immediately after cancel().
const SPEECH_START_DELAY_MS = 60;

function Badge({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "emerald" | "sky" | "purple";
}) {
  const accentClasses: Record<typeof accent, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    sky: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  };

  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-500 font-medium">
        {label}
      </span>
      <span
        className={`rounded-lg border px-3 py-1 text-xs font-semibold ${accentClasses[accent]}`}
      >
        {value}
      </span>
    </div>
  );
}

function InterviewRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");

  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // State for Conversation History Modal / Drawer toggle
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const [company, setCompany] = useState<string>(searchParams.get("company") ?? "Google");
  const [type, setType] = useState<string>(searchParams.get("type") ?? "Technical");
  const [mood, setMood] = useState<string>(searchParams.get("mood") ?? "Professional");

  const defaultIntro = `Welcome to your ${company} ${type} interview! Whenever you're ready, please introduce yourself and tell me about your background.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      content: defaultIntro,
    },
  ]);

  // Text the user is currently typing into the answer box
  const [answerDraft, setAnswerDraft] = useState<string>("");

  // Typewriter effect state for the current AI question
  const [displayedQuestion, setDisplayedQuestion] = useState<string>("");
  const currentAiText = [...messages].reverse().find((m) => m.sender === "ai")?.content || "";

  useEffect(() => {
    if (!currentAiText) {
      setDisplayedQuestion("");
      return;
    }

    // Show the first character immediately so it never gets swallowed by
    // the initial interval delay, then continue one character at a time.
    setDisplayedQuestion(currentAiText.charAt(0));
    let index = 1;

    const timer = setInterval(() => {
      if (index < currentAiText.length) {
        setDisplayedQuestion((prev) => prev + currentAiText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, TYPEWRITER_SPEED_MS);

    return () => clearInterval(timer);
  }, [currentAiText]);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Delay the actual speak() call slightly — calling it back-to-back
      // with cancel() is what causes the first letter/word to get cut off.
      window.setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }, SPEECH_START_DELAY_MS);
    }
  };

  // Speak initial intro message on mount so it's heard loud and clear
  const hasSpokenIntro = useRef(false);
  useEffect(() => {
    if (!hasSpokenIntro.current && defaultIntro) {
      hasSpokenIntro.current = true;
      speakText(defaultIntro);
    }
  }, [defaultIntro]);

  const extractTextContent = (raw: any): string => {
    if (!raw) return "";
    if (typeof raw === "string") return raw;
    if (typeof raw === "object") {
      if (typeof raw.content === "string") return raw.content;
      if (typeof raw.content === "object" && raw.content !== null) {
        return extractTextContent(raw.content);
      }
      if (typeof raw.text === "string") return raw.text;
      if (typeof raw.message === "string") return raw.message;
      if (typeof raw.question === "string") return raw.question;
      if (typeof raw.aiResponse === "string") return raw.aiResponse;
      if (typeof raw.reply === "string") return raw.reply;
      if (typeof raw.response === "string") return raw.response;
    }
    return String(raw);
  };

  useEffect(() => {
    async function requestMediaPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasCameraPermission(true);
      } catch (err) {
        console.error("Camera/Microphone permission denied:", err);
        setHasCameraPermission(false);
      }
    }
    requestMediaPermission();
  }, []);

  useEffect(() => {
    if (hasCameraPermission === false || hasCameraPermission === null) return;

    let isMounted = true;
    const token = localStorage.getItem("token");
    const isGuest = localStorage.getItem("isGuest") === "true";

    if (!token && !isGuest) {
      router.push("/login");
      return;
    }

    async function loadInterviewSession() {
      if (!interviewId) {
        if (isMounted) setIsLoadingSession(false);
        return;
      }

      try {
        const sessionData = await apiFetch(`/api/interview/${interviewId}`);
        if (isMounted && sessionData) {
          if (sessionData.company) setCompany(sessionData.company);
          if (sessionData.type || sessionData.interviewType) {
            setType(sessionData.type || sessionData.interviewType);
          }
          if (sessionData.mood) setMood(sessionData.mood);

          if (Array.isArray(sessionData.messages) && sessionData.messages.length > 0) {
            const formattedMessages: Message[] = sessionData.messages.map((msg: RawSessionMessage) => {
              const textVal = extractTextContent(msg.content || msg.text || msg);
              return {
                sender: msg.sender === "user" || msg.role === "user" ? "user" : "ai",
                content: textVal,
              };
            });
            setMessages(formattedMessages);
            const lastAi = [...formattedMessages].reverse().find((m) => m.sender === "ai");
            if (lastAi) speakText(lastAi.content);
          }
        }
      } catch (err) {
        if (isMounted) console.error("Failed to load interview session details:", err);
      } finally {
        if (isMounted) setIsLoadingSession(false);
      }
    }

    loadInterviewSession();
    return () => {
      isMounted = false;
    };
  }, [interviewId, router, hasCameraPermission]);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const sendAnswer = async (answerText: string) => {
    if (!answerText.trim() || isSending) return;

    setIsSending(true);
    const updatedUserMessages: Message[] = [
      ...messages,
      { sender: "user", content: answerText },
    ];
    setMessages(updatedUserMessages);

    resetTranscript?.();
    if (isListening) stopListening();
    setAnswerDraft("");

    try {
      if (!interviewId) {
        setIsSending(false);
        return;
      }

      const response = await apiFetch(`/api/interview/${interviewId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: answerText,
          message: answerText,
          history: updatedUserMessages,
        }),
      });

      const aiResponseContent = extractTextContent(
        response?.message || response?.content || response?.reply || response?.response || response
      );

      if (aiResponseContent) {
        const finalHistory: Message[] = [
          ...updatedUserMessages,
          { sender: "ai", content: aiResponseContent },
        ];
        setMessages(finalHistory);
        speakText(aiResponseContent);
      } else {
        throw new Error("Empty AI response text extracted.");
      }
    } catch (error) {
      console.error("Failed to send message to AI backend:", error);
      const errorMsg = "Sorry, I encountered an error receiving a response from the server.";
      setMessages([...updatedUserMessages, { sender: "ai", content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Fixed handleEnd function to correctly direct to completion metrics page
  const handleEnd = async () => {
  if (isEnding) return;

  setIsEnding(true);

  try {
    if (!interviewId) {
      router.push("/dashboard");
      return;
    }

    const data = await apiFetch(`/api/interview/${interviewId}/end`, {
      method: "POST",
    });

    console.log("END INTERVIEW RESPONSE:", data);

    router.push(
      `/interview/completed?interviewId=${encodeURIComponent(
        interviewId
      )}&company=${encodeURIComponent(company)}&type=${encodeURIComponent(type)}`
    );
  } catch (error) {
    console.error("FAILED TO END INTERVIEW:", error);

    alert("Could not complete the interview. Check the backend terminal.");

    setIsEnding(false);
  }
};

  if (hasCameraPermission === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white text-center">
        <div className="max-w-md rounded-2xl border border-red-500/35 bg-red-500/10 p-8 shadow-2xl">
          <h2 className="mb-3 text-2xl font-bold text-red-400">Camera & Microphone Required</h2>
          <p className="mb-6 text-sm text-neutral-300">
            You must grant camera and microphone permissions to enter the AI Mock Interview room.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (hasCameraPermission === null || isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 text-xl font-semibold animate-pulse">
            Requesting Camera & Loading Session...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Background />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] flex-col px-6 py-5">
        {/* Top Bar: logo left · badges centered · single End Interview right */}
        <div className="flex items-center justify-between mb-6 border-b border-neutral-800/70 pb-5 gap-6">
          {/* Logo - top left */}
          <div className="flex flex-col shrink-0">
            <span className="text-lg font-extrabold tracking-tight text-white leading-none">
              THE REAL ROOM
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
              AI Powered Mock Interview
            </span>
          </div>

          {/* 3 badges - centered, spaced */}
          <div className="flex flex-1 items-center justify-center gap-10">
            <Badge label="Company" value={company} accent="sky" />
            <Badge label="Interview" value={type} accent="emerald" />
            <Badge label="Mood" value={mood} accent="purple" />
          </div>

          {/* Single End Interview button - top right */}
          <button
            onClick={handleEnd}
            disabled={isEnding}
            className="shrink-0 cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-300 transition hover:bg-red-500/20 disabled:pointer-events-none disabled:opacity-50 shadow-sm"
          >
            {isEnding ? "Ending..." : "End Interview"}
          </button>
        </div>

        <div className="grid flex-1 grid-cols-12 gap-6 items-start">
          {/* Left Column: Avatar and Info */}
          <div className="col-span-3 flex flex-col gap-5">
            <AIAvatar mood={mood} isSpeaking={isSending} />
            <InterviewInfo company={company} type={type} mood={mood} />
          </div>

          {/* Center Column: Question display + answer input + live transcription */}
          <div className="col-span-6 flex flex-col gap-5">
            {/* Single, authoritative Current Question panel */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-lg backdrop-blur overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-800/70 px-5 py-3">
                <span className="text-[11px] uppercase tracking-[0.16em] text-emerald-400/90 font-semibold">
                  Current Question
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isSending ? "Interviewer is responding…" : "Awaiting your answer"}
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-neutral-100 text-base leading-relaxed">
                  {displayedQuestion}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-emerald-400 animate-pulse align-middle"></span>
                </p>
              </div>

              {/* Answer input, built into the same panel instead of a duplicate card */}
              <div className="border-t border-neutral-800/70 bg-black/20 px-5 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendAnswer(answerDraft);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    disabled={isSending}
                    placeholder="Type your response here…"
                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-emerald-500/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !answerDraft.trim()}
                    className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Live speech transcription view box - enlarged */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-md backdrop-blur flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-blue-400/90 font-semibold">
                  Live Speech Transcription
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isListening
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isListening ? "Listening…" : "Idle"}
                </span>
              </div>
              <div className="min-h-[140px] max-h-[240px] overflow-y-auto rounded-xl bg-black/40 p-3 text-sm text-neutral-200 border border-neutral-800/60">
                {transcript ? (
                  <p>{transcript}</p>
                ) : (
                  <p className="text-neutral-500 italic">
                    Your spoken voice text will appear here in real-time as you speak…
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Webcam, Voice controls, Timer, Notes, Conversation History */}
          <div className="col-span-3 flex flex-col gap-5">
            <WebcamPanel cameraOn={cameraOn} />
            <VoiceControls
              cameraOn={cameraOn}
              setCameraOn={setCameraOn}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              onSendSpeech={() => sendAnswer(transcript)}
            />
            <Timer onTimeUp={handleEnd} />
            <Notes />

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-3 px-4 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-800 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              Conversation History
            </button>
          </div>
        </div>
      </div>

      {/* Conversation History Modal Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">Full Conversation History</h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-neutral-400 hover:text-white text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-xs text-neutral-500 mb-1 capitalize">
                    {msg.sender === "user" ? "You" : "Interviewer"}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700/50"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="rounded-xl bg-neutral-800 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function InterviewRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black p-10 text-white">
          Loading Interview Room...
        </div>
      }
    >
      <InterviewRoomContent />
    </Suspense>
  );
}