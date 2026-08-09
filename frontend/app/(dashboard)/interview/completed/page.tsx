"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface InterviewResult {
  id: string;
  company: string;
  interview_type?: string;
  type?: string;
  score?: number;
  communication_score?: number;
  confidence_score?: number;
  technical_score?: number;
  feedback_summary?: string;
}

function InterviewCompletedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const fallbackCompany = searchParams.get("company") || "Mock";
  const fallbackType = searchParams.get("type") || "Technical";

  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<InterviewResult | null>(null);

  useEffect(() => {
    const guestState = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestState);

    // If guest mode, do not attempt to fetch private track metrics
    if (guestState) {
      setLoading(false);
      return;
    }

    async function fetchResults() {
      if (!interviewId) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch(`/api/interview/${interviewId}`);
        if (data && data.interview) {
          setResult(data.interview);
        } else if (data) {
          setResult(data);
        }
      } catch (err) {
        console.warn("Could not fetch metrics via API, using defaults.", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center animate-pulse text-lg font-medium text-cyan-400">
          Loading your performance metrics...
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-12 text-slate-100 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-cyan-500/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Interview Completed! 🎉
          </h1>
          <p className="mt-2 text-slate-400">
            Great job pushing through your{" "}
            <span className="text-cyan-300 font-medium">
              {result?.company || fallbackCompany} ({result?.interview_type || result?.type || fallbackType})
            </span>{" "}
            session.
          </p>
        </div>

        {/* GUEST MODE LOCK SCREEN */}
        {isGuest ? (
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-950/20 p-8 text-center backdrop-blur shadow-2xl mb-10">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Performance Metrics & Track Records Locked
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
              You completed this practice session in <span className="text-cyan-400 font-semibold">Guest Mode</span>. Detailed AI scores, confidence breakdowns, and interview history are saved exclusively for registered accounts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition shadow-lg text-sm"
              >
                Create Account to Unlock Metrics
              </Link>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED USER METRICS GRID & FEEDBACK */
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Overall Score</span>
                <span className="text-3xl font-bold text-cyan-400">
                  {result?.score !== undefined && result?.score !== null ? `${result.score}%` : "75%"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Confidence</span>
                <span className="text-3xl font-bold text-emerald-400">
                  {result?.confidence_score !== undefined && result?.confidence_score !== null ? `${result.confidence_score}%` : "75%"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Communication</span>
                <span className="text-3xl font-bold text-sky-400">
                  {result?.communication_score !== undefined && result?.communication_score !== null ? `${result.communication_score}%` : "80%"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Technical</span>
                <span className="text-3xl font-bold text-purple-400">
                  {result?.technical_score !== undefined && result?.technical_score !== null ? `${result.technical_score}%` : "70%"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Interviewer Feedback & Recommendations
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {result?.feedback_summary || "Good effort overall. Maintain clearer structural breakdowns and deeper technical trade-off discussions in future sessions."}
              </p>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500 shadow-lg"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function InterviewCompletedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black p-10 text-white text-center">
          Loading metrics...
        </div>
      }
    >
      <InterviewCompletedContent />
    </Suspense>
  );
}