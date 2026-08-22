"use client";

import { Mic, MicOff, Video, VideoOff, Send } from "lucide-react";

interface VoiceControlsProps {
  cameraOn: boolean;
  setCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  onSendSpeech?: () => void;
}

export default function VoiceControls({
  cameraOn,
  setCameraOn,
  isListening,
  startListening,
  stopListening,
  onSendSpeech,
}: VoiceControlsProps) {
  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-center gap-4">
        {/* Camera Toggle */}
        <button
          type="button"
          onClick={() => setCameraOn(!cameraOn)}
          className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all ${
            cameraOn
              ? "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,.6)]"
              : "bg-red-600 hover:bg-red-500"
          }`}
          title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* Microphone Toggle */}
        <button
          type="button"
          onClick={toggleMic}
          className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-all ${
            isListening
              ? "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_25px_rgba(34,211,238,.6)]"
              : "bg-red-600 hover:bg-red-500"
          }`}
          title={isListening ? "Mute Microphone" : "Start Speaking"}
        >
          {isListening ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

        {/* Send Spoken Response */}
        {onSendSpeech && (
          <button
            type="button"
            onClick={onSendSpeech}
            disabled={!isListening}
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-emerald-600 transition-all hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,.4)] disabled:pointer-events-none disabled:opacity-30"
            title="Send Spoken Answer"
          >
            <Send size={22} />
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-slate-400">
        {isListening
          ? "Microphone Active — Speak & Click Send"
          : "Microphone Muted"}
      </p>
    </div>
  );
}