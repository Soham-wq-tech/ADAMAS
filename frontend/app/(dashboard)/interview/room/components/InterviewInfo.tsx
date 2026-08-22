"use client";

interface Props {
  company: string;
  type: string;
  mood: string;
}

export default function InterviewInfo({
  company,
  type,
  mood,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

      <h2 className="mb-6 text-lg font-semibold text-white">
        Interview Details
      </h2>

      <div className="space-y-5">

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Company
          </p>

          <p className="mt-2 text-lg font-semibold">
            {company}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Interview Type
          </p>

          <p className="mt-2 text-lg font-semibold capitalize">
            {type}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Interview Mood
          </p>

          <p className="mt-2 text-lg font-semibold capitalize">
            {mood}
          </p>
        </div>

      </div>

    </div>
  );
}