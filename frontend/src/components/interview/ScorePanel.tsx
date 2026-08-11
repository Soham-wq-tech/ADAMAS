"use client";

export default function ScorePanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Live Analysis
      </h2>

      <div className="space-y-4">

        <Metric title="Communication" value="--" />
        <Metric title="Confidence" value="--" />
        <Metric title="Technical" value="--" />
        <Metric title="Problem Solving" value="--" />

      </div>

    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-black/30 p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}