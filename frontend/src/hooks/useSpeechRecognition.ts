"use client";

import { useState, useRef } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export default function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      setTranscript(currentTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  };
}