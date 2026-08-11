"use client";

import { Home, Code, Mic, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const items = [
    { icon: Home, label: "Interview" },
    { icon: Mic, label: "Voice" },
    { icon: Code, label: "Coding" },
    { icon: BarChart3, label: "Analytics" },
  ];

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="mb-3 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition hover:bg-cyan-500/10"
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  );
}