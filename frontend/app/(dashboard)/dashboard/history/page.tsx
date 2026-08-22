// app/(dashboard)/history/page.tsx
// History page for listing past interview sessions and performance scores

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface InterviewSession {
  id: string;
  company: string;
  type: string;
  mood: string;
  createdAt: string;
  status: "COMPLETED" | "IN_PROGRESS" | "ENDED";
  score?: number | null;
  totalQuestions?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth Guard & Fetch History
  useEffect(() => {
    const token = localStorage.getItem("token");
    const guestState = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestState);

    if (!token && !guestState) {
      router.push("/login");
      return;
    }

    // If guest, do not fetch track records from server
    if (guestState) {
      setIsLoading(false);
      return;
    }

    async function loadHistory() {
      try {
        let data;
        try {
          data = await apiFetch("/api/interview/history");
        } catch {
          data = await apiFetch("/api/interviews");
        }

        const list = Array.isArray(data)
          ? data
          : data?.interviews || data?.history || [];

        setInterviews(list);
      } catch (err: any) {
        console.warn("Could not load history from backend:", err);
        setError("Failed to load past interviews. Displaying empty state.");
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-slate-100 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-cyan-400/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Interview{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Review your past practice sessions and feedback scores
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {isGuest ? (
          /* GUEST MODE LOCK STATE FOR HISTORY */
          <div className="rounded-3xl border border-cyan-500/30 bg-cyan-950/20 p-12 text-center backdrop-blur shadow-2xl">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Track Records Locked in Guest Mode</h3>
            <p className="mt-1 max-w-md mx-auto text-sm text-slate-300 mb-6">
              Interview history, session transcripts, and score tracking are saved exclusively for registered accounts.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500 shadow-lg"
            >
              Sign Up / Register to Save History
            </Link>
          </div>
        ) : (
          /* AUTHENTICATED USER HISTORY LIST */
          <>
            {error && (
              <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-slate-400">
                Loading interview history...
              </div>
            ) : interviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl text-cyan-400">
                  🎙️
                </div>
                <h3 className="text-lg font-semibold text-white">No interviews found</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  You haven't completed any practice interviews yet. Start a new session to track your history.
                </p>
                <Link
                  href="/interview/setup"
                  className="mt-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500"
                >
                  Start Practice Interview
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {interviews.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-500/40 hover:bg-white/[0.07] sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-lg font-bold text-cyan-400">
                        {item.company ? item.company[0]?.toUpperCase() : "I"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.company} — <span className="capitalize">{item.type}</span>
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span>Mood: {item.mood}</span>
                          <span>•</span>
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
                      {item.score !== undefined && item.score !== null && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Score</div>
                          <div className="text-lg font-bold text-cyan-300">
                            {item.score}/100
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/interview/room?interviewId=${item.id}&company=${encodeURIComponent(
                          item.company
                        )}&type=${encodeURIComponent(item.type)}&mood=${encodeURIComponent(
                          item.mood
                        )}`}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        View Session →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}