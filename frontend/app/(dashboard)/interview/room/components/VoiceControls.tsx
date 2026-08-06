"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface VoiceControlsProps {
  cameraOn: boolean;
  setCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}
export default function VoiceControls({
  cameraOn,
  setCameraOn,
  isListening,
  startListening,
  stopListening,
}: VoiceControlsProps) {
  

 

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <div className="flex items-center justify-center gap-5">

        {/* Camera */}
        <button
          onClick={() => setCameraOn(!cameraOn)}
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all
  ${
    cameraOn
      ? "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,.6)]"
      : "bg-red-600 hover:bg-red-500"
  }`}
        >
          {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* Microphone */}
        <button
          onClick={toggleMic}
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-all
  ${
    isListening
      ? "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,.6)]"
      : "bg-red-600 hover:bg-red-500"
  }`}
        >
          {isListening ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

      </div>

      <p className="mt-4 text-center text-sm text-slate-400">
        {isListening ? "Microphone Active" : "Microphone Muted"}
      </p>
    </div>
  );
}