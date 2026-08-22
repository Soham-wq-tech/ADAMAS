"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-5xl px-6"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Select Your Experience
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Choose How You Want to Practice
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Simulate an uncompromised high-stakes assessment or build deep conceptual mastery with an interactive AI mentor.
          </p>

          {/* Dual Action Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
            
            {/* Real Room Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40">
              <div>
                <div className="mb-4 flex items-center gap-3 text-cyan-400">
                  <Terminal size={22} />
                  <h3 className="text-xl font-bold text-white">The Real Room</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Real-world technical interview simulation. Evaluates speed, communication, and accuracy under strict time pressure.
                </p>
              </div>

              <Link
                href="/interview/room"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-3.5 font-semibold text-cyan-300 transition-all duration-300 hover:bg-cyan-400 hover:text-black"
              >
                <span>Enter The Real Room</span>
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Socratic Mode Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/60">
              <div>
                <div className="mb-4 flex items-center gap-3 text-indigo-400">
                  <Sparkles size={22} />
                  <h3 className="text-xl font-bold text-white">Socratic Studio</h3>
                </div>
                <p className="text-sm text-slate-400">
                  Interactive dialectic mentorship. Learn through guided probes, progressive nudges, and conceptual reasoning maps.
                </p>
              </div>

              <Link
                href="/socratic/room"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
              >
                <span>Enter Socratic Mode</span>
                <Sparkles size={18} />
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}