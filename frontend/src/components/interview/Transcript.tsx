"use client";

export default function Transcript() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Transcript
      </h2>

      <div className="min-h-[180px] rounded-xl bg-black/40 p-4 text-gray-400">
        Your spoken answer will appear here...
      </div>
    </div>
  );
}