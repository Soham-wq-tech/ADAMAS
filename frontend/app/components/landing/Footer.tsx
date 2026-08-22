import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            The <span className="text-cyan-400">Real Room</span>
          </h2>

          <p className="mt-4 max-w-sm text-slate-400">
            The Room You Enter Before The Real Room.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-white font-semibold">
            Quick Links
          </h3>

          <div className="space-y-3 text-slate-400">
            <a href="#modes" className="block hover:text-cyan-400 transition">
              Modes
            </a>

            <a href="#how-it-works" className="block hover:text-cyan-400 transition">
              How It Works
            </a>

            <a href="#resources" className="block hover:text-cyan-400 transition">
              Resources
            </a>

            <Link href="/login" className="block hover:text-cyan-400 transition">
              Login
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Purpose
          </h3>

          <p className="text-slate-400">
            Student Placement Prep 🎯
          </p>

          <p className="mt-2 text-slate-500 text-sm">
            Mock Interview & Socratic Learning Platform
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
        © 2026 The Real Room. All rights reserved.
      </div>
    </footer>
  );
}