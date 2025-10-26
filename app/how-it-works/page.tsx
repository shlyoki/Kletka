export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Create or join events',
      description:
        'Organizers publish friendly fight nights with safety requirements. Fighters browse open calls and request bouts.',
    },
    {
      title: 'Confirm readiness',
      description:
        'Digital waivers, equipment checklists, and medical flags keep every participant cleared before the first bell.',
    },
    {
      title: 'Compete and record results',
      description:
        'Judges score with the 10-point must system while leaderboards and fighter analytics update automatically.',
    },
    {
      title: 'Celebrate the community',
      description:
        'Share media, post-event feedback, and forum threads to grow your crew between cards.',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Welcome</p>
        <h1 className="text-3xl font-semibold text-white">How MMA Friends League works</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Whether you organize, compete, judge, or cheer, the platform keeps everyone informed and safe. Follow the steps below to
          get rolling.
        </p>
      </header>
      <ol className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
            <span className="text-xs uppercase tracking-wide text-white/40">Step {index + 1}</span>
            <h2 className="mt-2 text-xl font-semibold text-white">{step.title}</h2>
            <p className="mt-2 text-white/60">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
