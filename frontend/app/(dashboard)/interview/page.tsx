<<<<<<< HEAD
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
=======
// app/interview/setup/page.tsx
// Setup page for configuring and launching a practice interview

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface CompanyOption {
  name: string;
  initial?: string;
}

interface InterviewTypeOption {
  id: string;
  label: string;
  blurb: string;
}

interface MoodOption {
  id: string;
  label: string;
  blurb: string;
}

// ---------------------------------------------------------------------------
// Static Fallback Content
// ---------------------------------------------------------------------------

const DEFAULT_COMPANIES: CompanyOption[] = [
>>>>>>> origin/main
  { name: "Google", initial: "G" },
  { name: "Microsoft", initial: "M" },
  { name: "Amazon", initial: "A" },
  { name: "NVIDIA", initial: "N" },
  { name: "Apple", initial: "A" },
  { name: "Meta", initial: "M" },
  { name: "Atlassian", initial: "A" },
  { name: "Uber", initial: "U" },
];

<<<<<<< HEAD
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
=======
const DEFAULT_INTERVIEW_TYPES: InterviewTypeOption[] = [
  { id: "HR", label: "HR", blurb: "Behavioral, culture-fit questions" },
  { id: "Technical", label: "Technical", blurb: "System design & concepts" },
  { id: "DSA", label: "DSA", blurb: "Data structures & algorithms" },
];

const DEFAULT_MOODS: MoodOption[] = [
  { id: "Friendly", label: "Friendly", blurb: "Warm, encouraging tone" },
  { id: "Professional", label: "Professional", blurb: "Neutral, standard pace" },
  { id: "Strict", label: "Strict", blurb: "Terse, no hand-holding" },
  { id: "Aggressive", label: "Aggressive", blurb: "Pushes back, high pressure" },
];

// ---------------------------------------------------------------------------
// Page Component
>>>>>>> origin/main
// ---------------------------------------------------------------------------

export default function InterviewSetupPage() {
  const router = useRouter();

<<<<<<< HEAD
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
=======
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Authentication & Guest Guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestState = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestState);

    if (!token && !guestState) {
      router.push("/login");
    }
  }, [router]);

  // Options State
  const [companies, setCompanies] = useState<CompanyOption[]>(DEFAULT_COMPANIES);
  const [interviewTypes, setInterviewTypes] = useState<InterviewTypeOption[]>(DEFAULT_INTERVIEW_TYPES);
  const [moods, setMoods] = useState<MoodOption[]>(DEFAULT_MOODS);

  // User Selection State
  const [company, setCompany] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  
  // Resume Upload State
  const [resumeText, setResumeText] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  
  // UI Loading & Error State
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamically load options from GET /api/interview/options with useEffect
  useEffect(() => {
    let isMounted = true;

    async function fetchOptions() {
      try {
        const options = await apiFetch("/api/interview/options");
        if (!isMounted || !options) return;

        if (Array.isArray(options.companies) && options.companies.length > 0) {
          setCompanies(
            options.companies.map((c: string | CompanyOption) =>
              typeof c === "string"
                ? { name: c, initial: c[0]?.toUpperCase() || "C" }
                : c
            )
          );
        }

        if (Array.isArray(options.types) && options.types.length > 0) {
          setInterviewTypes(
            options.types.map((t: string | InterviewTypeOption) =>
              typeof t === "string"
                ? { id: t, label: t, blurb: `${t} interview session` }
                : t
            )
          );
        }

        if (Array.isArray(options.moods) && options.moods.length > 0) {
          setMoods(
            options.moods.map((m: string | MoodOption) =>
              typeof m === "string"
                ? { id: m, label: m, blurb: `${m} interviewer style` }
                : m
            )
          );
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using default options fallback:", err);
        }
      }
    }

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const isReady = useMemo(
    () => Boolean(company && type && mood),
    [company, type, mood]
  );

  // Resume File Reader Handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === "text/plain") {
      const text = await file.text();
      setResumeText(text);
    } else {
      setResumeText(`Candidate uploaded resume file: ${file.name}`);
    }
  };

  const handleStart = async () => {
    if (!isReady || isStarting) return;

    setIsStarting(true);
    setErrorMessage(null);

    try {
      const data = await apiFetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          type,
          mood,
          resume_text: isGuest ? "" : resumeText, // Clear resume text if guest
        }),
      });

      const interviewId = data?.interview?.id || data?.id || data?.interviewId;

      if (interviewId) {
        router.push(
          `/interview/room?interviewId=${interviewId}&company=${encodeURIComponent(
            company!
          )}&type=${encodeURIComponent(type!)}&mood=${encodeURIComponent(mood!)}`
        );
      } else {
        throw new Error("Missing interview ID in backend response.");
      }
    } catch (error: unknown) {
      console.error("Failed to start interview:", error);
      const err = error as Error;
      setErrorMessage(
        err?.message || "Failed to start interview. Please check your network or try again."
      );
      setIsStarting(false);
    }
>>>>>>> origin/main
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-slate-100 sm:px-10">
<<<<<<< HEAD
      {/* Ambient glow, consistent with the rest of the app */}
=======
>>>>>>> origin/main
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-cyan-400/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
<<<<<<< HEAD
        {/* Header */}
=======
>>>>>>> origin/main
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
<<<<<<< HEAD
          
=======
>>>>>>> origin/main
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Set up your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            interview
          </span>
        </h1>
        <p className="mt-2 text-slate-400">
<<<<<<< HEAD
          Choose a company, the type of interview, and how your AI interviewer should feel.
        </p>

=======
          Choose a company, the type of interview, and how your AI interviewer
          should feel.
        </p>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

>>>>>>> origin/main
        {/* Step 1 — Company */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Company
<<<<<<< HEAD
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
=======
            {company && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                — {company}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {companies.map((item) => {
              const selected = company === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCompany(item.name)}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                    selected
                      ? "border-cyan-500/60 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
                    {item.initial || item.name[0]}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
>>>>>>> origin/main
                </button>
              );
            })}
          </div>
        </section>

<<<<<<< HEAD
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
=======
        {/* Step 2 — Interview Type */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Interview Type
            {type && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                — {type}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {interviewTypes.map((t) => {
>>>>>>> origin/main
              const selected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
<<<<<<< HEAD
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
=======
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-500/60 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="text-base font-semibold text-white">{t.label}</div>
                  <div className="mt-1 text-xs text-slate-400">{t.blurb}</div>
>>>>>>> origin/main
                </button>
              );
            })}
          </div>
        </section>

<<<<<<< HEAD
        {/* Step 3 — Mood */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Interviewer mood
            {mood && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                {MOODS.find((m) => m.id === mood)?.label}
=======
        {/* Step 3 — Interviewer Mood */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Interviewer Mood
            {mood && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                — {mood}
>>>>>>> origin/main
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
<<<<<<< HEAD
            {MOODS.map((m) => {
=======
            {moods.map((m) => {
>>>>>>> origin/main
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
<<<<<<< HEAD
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
=======
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-500/60 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{m.label}</div>
                  <div className="mt-1 text-xs text-slate-400">{m.blurb}</div>
>>>>>>> origin/main
                </button>
              );
            })}
          </div>
        </section>

<<<<<<< HEAD
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
=======
        {/* Step 4 — Upload Resume (Optional) - Blocked in Guest Mode */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
            Upload Resume (Optional)
            {!isGuest && fileName && (
              <span className="text-xs font-normal normal-case text-cyan-300">
                — {fileName} uploaded
              </span>
            )}
          </h2>

          {isGuest ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center backdrop-blur">
              <p className="text-xs text-slate-400">
                🔒 <span className="font-semibold text-slate-200">Resume Tailoring</span> is locked in Guest Mode.{" "}
                <Link href="/login" className="text-cyan-400 underline font-medium">
                  Sign In / Register
                </Link>{" "}
                to upload your resume for personalized questions.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleResumeUpload}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
              />
              <p className="mt-2 text-xs text-slate-500">
                Gemini will read your resume to tailor interview questions around your projects and background.
              </p>
            </div>
          )}
        </section>

        {/* Launch Button */}
        <div className="mt-12 flex justify-end">
          <button
            type="button"
            disabled={!isReady || isStarting}
            onClick={handleStart}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500 disabled:pointer-events-none disabled:opacity-50"
          >
            {isStarting ? "Starting Room..." : "Enter Interview Room →"}
          </button>
>>>>>>> origin/main
        </div>
      </div>
    </main>
  );
}