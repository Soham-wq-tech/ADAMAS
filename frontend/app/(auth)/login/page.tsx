// app/(auth)/login/page.tsx
// Next.js (App Router) + Tailwind sign-in page, matching The Real Room's landing page theme.

"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Basic RFC-5322-ish email check — good enough to catch obviously malformed
// input on the client. The backend should still do its own real validation
// (and actual verification, e.g. confirmation email) — this is not a
// substitute for that.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailError(null);

    // TODO: replace with a real auth call to your backend, e.g.
    // const res = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email: trimmedEmail, password }),
    // });
    // if (!res.ok) { setEmailError("Invalid email or password."); return; }
    // On success:
    router.push("/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-slate-100">
      <div className="absolute left-6 top-6 z-20">
        <Link
          href="/"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Ambient glow, consistent with landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / brand */}
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-white">The </span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Real Room
            </span>
          </h1>

          <p className="mt-3 text-center text-slate-400">
            The Room You Enter Before The Real Room.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Welcome to The Real Room</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue practicing.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : undefined}
                className={`w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 ${
                  emailError
                    ? "border-red-400/60 focus:border-red-400/60 focus:ring-red-400/20"
                    : "border-white/10 focus:border-blue-400/60 focus:bg-white/[0.07] focus:ring-blue-400/20"
                }`}
              />
              {emailError && (
                <p id="email-error" className="mt-1.5 text-xs text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-blue-400 transition hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 transition hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.92h5.4c-.23 1.4-1.63 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.09.79 3.8 1.47l2.59-2.5C16.9 3.43 14.85 2.5 12.18 2.5c-5.25 0-9.5 4.25-9.5 9.5s4.25 9.5 9.5 9.5c5.48 0 9.12-3.85 9.12-9.27 0-.62-.07-1.1-.15-1.63Z"
              />
            </svg>
            Continue with Google
          </button>

          <Link
            href="/dashboard"
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-medium text-cyan-300 transition hover:bg-cyan-400/20 hover:border-cyan-400/40"
          >
            Continue as Guest →
          </Link>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}