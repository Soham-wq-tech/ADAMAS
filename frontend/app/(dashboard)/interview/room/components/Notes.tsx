"use client";

export default function Notes() {
  return (
    <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-lg font-semibold">
          Notes
        </h2>

        <span className="text-xs text-slate-500">
          Auto Save
        </span>

      </div>

      <textarea
        placeholder="Write notes during your interview..."
        className="h-72 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none transition focus:border-cyan-400"
      />

    </div>
  );
}