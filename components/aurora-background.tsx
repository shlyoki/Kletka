export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
      <div className="absolute -bottom-24 right-[-6rem] h-[22rem] w-[22rem] rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute left-[-12rem] top-1/3 h-[18rem] w-[18rem] rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(75%_75%_at_50%_10%,rgba(255,255,255,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,59,48,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_60%)] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_0)] bg-[length:120px_120px] opacity-10" />
    </div>
  );
}
