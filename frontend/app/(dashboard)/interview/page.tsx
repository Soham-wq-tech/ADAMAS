// app/(dashboard)/interview/setup/page.tsx
// Next.js (App Router) + Tailwind — Interview setup screen, matching The Real Room theme.
// Choose Company -> Choose Interview Type -> Choose Mood -> Start Interview (routes to /interview).

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const COMPANIES = [
  { name: "Google", initial: "G" },
  { name: "Microsoft", initial: "M" },
  { name: "Amazon", initial: "A" },
  { name: "NVIDIA", initial: "N" },
  { name: "Apple", initial: "A" },
  { name: "Meta", initial: "M" },
  { name: "Atlassian", initial: "A" },
  { name: "Uber", initial: "U" },
];

const INTERVIEW_TYPES = [
  { id: "hr", label: "HR", blurb: "Behavioral, culture-fit questions" },
  { id: "technical", label: "Technical", blurb: "System design & concepts" },
  { id: "dsa", label: "DSA", blurb: "Data structures & algorithms" },
] as const;

const MOODS = [
  { id: "friendly", label: "Friendly", blurb: "Warm, encouraging tone" },
  { id: "professional", label: "Professional", blurb: "Neutral, standard pace" },
  { id: "strict", label: "Strict", blurb: "Terse, no hand-holding" },
  { id: "aggressive", label: "Aggressive", blurb: "Pushes back, high pressure" },
] as const;

type InterviewType = (typeof INTERVIEW_TYPES)[number]["id"];
type Mood = (typeof MOODS)[number]["id"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InterviewSetupPage() {
  const router = useRouter();

  const [company, setCompany] = useState<string | null>(null);
  const [type, setType] = useState<InterviewType | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const isReady = useMemo(() => Boolean(company && type && mood), [company, type, mood]);

  const handleStart = () => {
    if (!isReady) return;

    // TODO: replace with a real call to your backend to create the interview session, e.g.
    // const res = await fetch("/api/interview/start", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ company, type, mood }),
    // });
    // const { sessionId } = await res.json();
    // router.push(`/interview?session=${sessionId}`);

    const params = new URLSearchParams({
  company: company!,
  type: type!,
  mood: mood!,
});

router.push(`/interview/room?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-slate-100 sm:px-10">
      {/* Ambient glow, consistent with the rest of the app */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-cyan-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
          
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Set up your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            interview
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
          Choose a company, the type of interview, and how your AI interviewer should feel.
        </p>

        {/* Step 1 — Company */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Company
            {company && <span className="text-xs font-normal normal-case text-cyan-300">{company}</span>}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COMPANIES.map((c) => {
              const selected = company === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setCompany(c.name)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-300/50 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                      selected ? "bg-cyan-400/20 text-cyan-300" : "bg-white/5 text-slate-300"
                    }`}
                  >
                    {c.initial}
                  </div>
                  <span className={`text-sm font-medium ${selected ? "text-white" : "text-slate-200"}`}>
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 — Interview type */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Interview type
            {type && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                {INTERVIEW_TYPES.find((t) => t.id === type)?.label}
              </span>
            )}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {INTERVIEW_TYPES.map((t) => {
              const selected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-300/50 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <p className={`text-sm font-medium ${selected ? "text-white" : "text-slate-200"}`}>
                    {t.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{t.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3 — Mood */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Interviewer mood
            {mood && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                {MOODS.find((m) => m.id === mood)?.label}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MOODS.map((m) => {
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-300/50 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <p className={`text-sm font-medium ${selected ? "text-white" : "text-slate-200"}`}>
                    {m.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{m.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Start button */}
        <div className="mt-12 flex flex-col items-center">
          <button
            type="button"
            onClick={handleStart}
            disabled={!isReady}
            className="flex w-full max-w-sm items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-8 py-5 text-lg font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            🚪 Start Interview
          </button>
          {!isReady && (
            <p className="mt-3 text-xs text-slate-500">
              Pick a company, interview type, and mood to continue.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}