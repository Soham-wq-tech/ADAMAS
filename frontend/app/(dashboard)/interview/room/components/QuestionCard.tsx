"use client";

export default function QuestionCard() {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-white/[0.05] p-8 backdrop-blur-xl">

      <p className="text-sm uppercase tracking-widest text-cyan-300">

        Current Question

      </p>

      <h1 className="mt-5 text-3xl font-bold">

        Tell me about yourself.

      </h1>

      <p className="mt-5 text-slate-400 leading-7">

        Speak confidently.
        The AI interviewer is analysing your
        communication, confidence and technical knowledge.

      </p>

    </div>
  );
}