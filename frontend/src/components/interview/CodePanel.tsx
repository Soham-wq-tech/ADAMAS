"use client";

import Editor from "@monaco-editor/react";

export default function CodePanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Coding Round
      </h2>

      <Editor
        height="400px"
        defaultLanguage="javascript"
        defaultValue="// Start coding here..."
        theme="vs-dark"
      />
    </div>
  );
}