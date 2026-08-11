"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAvatar() {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-8 text-center">

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20"
      >
        <Bot size={50} />
      </motion.div>

      <h2 className="text-2xl font-bold">
        AI Interviewer
      </h2>

      <p className="mt-4 text-gray-400">
        Waiting to begin...
      </p>

    </div>
  );
}