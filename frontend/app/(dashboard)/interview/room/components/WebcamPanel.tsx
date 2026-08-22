"use client";

import Webcam from "react-webcam";

interface WebcamPanelProps {
  cameraOn: boolean;
}

export default function WebcamPanel({
  cameraOn,
}: WebcamPanelProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-black border border-white/10">
      {cameraOn ? (
        <Webcam
          audio={false}
          className="w-full"
        />
      ) : (
        <div className="flex h-56 items-center justify-center text-slate-400">
          Camera Off
        </div>
      )}
    </div>
  );
}