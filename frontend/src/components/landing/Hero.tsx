"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[160px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Blobs */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute left-20 top-32 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          y: [20, -20, 20],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute bottom-20 right-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
        >
          <Sparkles size={16} />
          AI Interview Experience
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold tracking-wide md:text-7xl"
        >
          THE{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            REAL ROOM
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 1,
          }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl"
        >
          Practice realistic AI interviews with voice interaction, coding
          challenges, instant feedback, analytics, and personalised improvement
          reports.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1,
          }}
          className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <button
            onClick={() => router.push("/interview")}
            className="group flex items-center gap-3 rounded-xl bg-cyan-400 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-300"
          >
            Enter The Room

            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={22}
            />
          </button>

          <button className="rounded-xl border border-gray-700 px-8 py-4 text-lg transition hover:border-cyan-400 hover:bg-white/5">
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.3,
          }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">AI Interviewer</h3>
            <p className="text-gray-400">
              Human-like conversation powered by advanced AI.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">Live Coding</h3>
            <p className="text-gray-400">
              Solve coding challenges inside the interview room.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="mb-3 text-xl font-semibold">Instant Feedback</h3>
            <p className="text-gray-400">
              Get scores, strengths and improvement suggestions immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}