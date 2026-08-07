"use client";

import Timer from "./Timer";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/40 px-8 py-5 backdrop-blur-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-[0.25em]">
          THE REAL ROOM
        </h1>

        <p className="text-sm text-gray-400">
          AI Powered Interview Simulator
        </p>
      </div>

      <Timer />
    </nav>
  );
}