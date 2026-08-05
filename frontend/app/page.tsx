// app/page.tsx
// Next.js (App Router) + Tailwind landing page
// Drop this in as your root page. Swap PRODUCT_NAME and copy for your team's project.
import HowItWorks from "./components/landing/HowItWorks";
import Link from "next/link";
import AIInterviewBackground from "./components/landing/AIInterviewBackground";
import ThreeHero from "./components/landing/ThreeHero";
import Companies from "./components/landing/Companies";
import Footer from "./components/landing/Footer";
const PRODUCT_NAME = "The Real Room";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <AIInterviewBackground />
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-400 to-sky-500" />
            <span className="text-base font-semibold text-white">{PRODUCT_NAME}</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">

  <a
    href="#how-it-works"
    className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
  >
    How It Works
  </a>

  <a
    href="#companies"
    className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
  >
    Companies
  </a>

  <a
    href="#resources"
    className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
  >
    Resources
  </a>

</div>
          <Link
            href="/login"
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center sm:pt-36">
        {/* Eyebrow badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          AI Interview Practice
        </span>

        {/* Headline */}
        <h1 className="mt-6 text-5xl font-bold uppercase tracking-tight sm:text-6xl">
          <span className="text-white">The </span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Real Room
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-slate-400 sm:text-lg">
          Practice real interviews with an AI that listens, adapts, and pushes back —
          then get a clear breakdown of what to fix before the real one.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
  href="/login"
  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-10 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-500/40"
>
  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

  <span className="relative flex items-center gap-3">
    Enter The Room
    <span className="text-xl transition-transform group-hover:translate-x-1">
      →
    </span>
  </span>
</Link>
          
        </div>

        <ThreeHero />
      </section>
      <HowItWorks />

<Companies />

{/* Resources Section */}
<section
  id="resources"
  className="relative z-10 mx-auto max-w-6xl px-6 py-24"
>
  <div className="text-center">
    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
      Resources
    </span>

    <h2 className="mt-6 text-4xl font-bold text-white">
      Prepare Before You Enter
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
      Curated DSA sheets, company-wise interview questions, and
      preparation materials to help you crack your dream company.
    </p>
  </div>

  <div className="mt-12 grid gap-6 md:grid-cols-3">

    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="text-xl font-semibold text-white">
        Company DSA Sheets
      </h3>
      <p className="mt-3 text-slate-400">
        Google, Amazon, Microsoft, Flipkart, TCS and more.
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="text-xl font-semibold text-white">
        Top Interview Questions
      </h3>
      <p className="mt-3 text-slate-400">
        Frequently asked coding and HR questions.
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="text-xl font-semibold text-white">
        Preparation Roadmaps
      </h3>
      <p className="mt-3 text-slate-400">
        Structured guides for placements and interviews.
      </p>
    </div>

  </div>
</section>

<Footer />
</main>
  );
}