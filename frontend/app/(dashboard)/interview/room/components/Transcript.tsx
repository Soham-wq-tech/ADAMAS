"use client";

export default function Transcript() {
  return (
    <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <h2 className="mb-6 text-xl font-semibold">
        Conversation
      </h2>

      <div className="space-y-6 overflow-y-auto">

        <div>

          <p className="font-semibold text-cyan-300">
            🤖 AI Interviewer
          </p>

          <div className="mt-2 rounded-2xl bg-cyan-500/10 p-4">

            Welcome to The Real Room.
            Tell me about yourself.

          </div>

        </div>

        <div>

          <p className="font-semibold text-blue-300">
            👤 You
          </p>

          <div className="mt-2 rounded-2xl bg-blue-500/10 p-4 text-slate-300">

            Your answer will appear here...

          </div>

        </div>

      </div>

    </div>
  );
}