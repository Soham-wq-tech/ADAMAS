"use client";

export default function Background() {
  return (
    <>
      {/* Main background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Glow 1 */}
      <div className="absolute -top-40 left-[-120px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[140px] animate-pulse" />

      {/* Animated Glow 2 */}
      <div className="absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[160px] animate-pulse" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:22px_22px]" />
    </>
  );
}