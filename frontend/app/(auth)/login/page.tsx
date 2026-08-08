// app/(auth)/login/page.tsx
// Login Page with Email/Password & Guest Support

"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side Password Validation Check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        localStorage.removeItem("isGuest");
        router.push("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Guest Sign In
  const handleGuestSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/guest", {
        method: "POST",
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        localStorage.setItem("isGuest", "true");
        router.push("/dashboard");
      } else {
        setError("Failed to sign in as guest.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-white">
          The Real Room
        </h1>
        <p className="text-sm text-gray-400">
          The Room You Enter Before The Real Room.
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#0D1117] p-8 shadow-2xl">
        <h2 className="mb-1 text-xl font-semibold text-white">
          Welcome to The Real Room
        </h2>
        <p className="mb-6 text-xs text-gray-400">
          Sign in to continue practicing.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-gray-300">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#161B22] px-3 py-2 text-sm text-white placeholder-gray-500 transition focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs text-gray-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-cyan-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-[#161B22] px-3 py-2 pr-12 text-sm text-white placeholder-gray-500 transition focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Must be at least 6 characters long.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-cyan-400 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-800"></div>
          <span className="absolute bg-[#0D1117] px-3 text-[10px] uppercase tracking-widest text-gray-500">
            or
          </span>
        </div>

        {/* Guest Option */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-cyan-800 bg-[#0D242B] py-2.5 text-xs font-medium text-cyan-400 transition hover:bg-[#0F2F39] disabled:opacity-50"
          >
            Continue as Guest →
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}