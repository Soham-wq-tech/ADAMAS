// app/(dashboard)/interview/setup/company/page.tsx
// Next.js (App Router) + Tailwind — Choose Company screen, matching The Real Room theme.

"use client";

import Link from "next/link";
import { useState } from "react";

const COMPANIES = [
  { name: "TCS", domain: "tcs.com" },
  { name: "Google", domain: "google.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Meta", domain: "meta.com" },
];

function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded bg-gradient-to-br from-blue-400 to-sky-500 text-sm font-bold text-white">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${name} logo`}
      className="h-full w-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function ChooseCompanyPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [customCompany, setCustomCompany] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelect = (name: string) => {
    setSelected(name);
    setShowCustomInput(false);
  };

  const handleOthersClick = () => {
    setShowCustomInput(true);
    setSelected(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        {/* Step indicator */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-blue-400">
          Step 1 of 3
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-white sm:text-4xl">
          Which company are you preparing for?
        </h1>
        <p className="mt-3 text-center text-sm text-slate-400 sm:text-base">
          We&apos;ll tailor questions and interview style to match their real process.
        </p>

        {/* Company grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COMPANIES.map((company, i) => {
            const isSelected = selected === company.name;
            return (
              <button
                key={company.name}
                onClick={() => handleSelect(company.name)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`group animate-fade-in-up flex flex-col items-center gap-3 rounded-xl border p-6 opacity-0 transition-all duration-300 ${
                  isSelected
                    ? "border-blue-400/60 bg-blue-400/10 shadow-[0_0_24px_-4px_rgba(56,189,248,0.4)]"
                    : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/95 p-2 transition-transform duration-300 group-hover:scale-105">
                  <CompanyLogo name={company.name} domain={company.domain} />
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {company.name}
                </span>
              </button>
            );
          })}

          {/* Others card */}
          <button
            onClick={handleOthersClick}
            style={{ animationDelay: `${COMPANIES.length * 60}ms` }}
            className={`group animate-fade-in-up flex flex-col items-center gap-3 rounded-xl border p-6 opacity-0 transition-all duration-300 ${
              showCustomInput
                ? "border-blue-400/60 bg-blue-400/10 shadow-[0_0_24px_-4px_rgba(56,189,248,0.4)]"
                : "border-white/10 border-dashed bg-white/[0.03] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 text-lg text-slate-400 transition-transform duration-300 group-hover:scale-105 group-hover:text-white">
              +
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                showCustomInput ? "text-white" : "text-slate-300 group-hover:text-white"
              }`}
            >
              Others
            </span>
          </button>
        </div>

        {/* Custom company input — animated reveal */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showCustomInput ? "mt-6 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <input
            type="text"
            value={customCompany}
            onChange={(e) => setCustomCompany(e.target.value)}
            placeholder="Enter company name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>

        {/* Continue button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/interview/setup/type"
            aria-disabled={!selected && !customCompany}
            className={`inline-flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium transition ${
              selected || customCompany
                ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                : "pointer-events-none bg-white/10 text-slate-500"
            }`}
          >
            Continue
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}