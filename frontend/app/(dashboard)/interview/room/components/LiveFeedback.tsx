"use client";

function Bar({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span>{title}</span>

        <span>{value}%</span>

      </div>

      <div className="h-2 rounded-full bg-white/10">

        <div
          className={`h-2 rounded-full ${color}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

export default function LiveFeedback() {
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">

      <h2 className="mb-6 text-lg font-semibold">
        Live Feedback
      </h2>

      <div className="space-y-5">

        <Bar
          title="Confidence"
          value={86}
          color="bg-cyan-400"
        />

        <Bar
          title="Communication"
          value={92}
          color="bg-blue-500"
        />

        <Bar
          title="Technical"
          value={74}
          color="bg-purple-500"
        />

      </div>

    </div>
  );
}