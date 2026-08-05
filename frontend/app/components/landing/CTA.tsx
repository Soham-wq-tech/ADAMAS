"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Ready?
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Enter{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              The Real Room
            </span>
            ?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Experience AI-powered interviews that simulate real company
            environments, evaluate your performance, and prepare you for the
            interview that truly matters.
          </p>

          <Link
            href="/login"
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-300"
          >
            Enter The Room

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>

        </div>
      </motion.div>
    </section>
  );
}