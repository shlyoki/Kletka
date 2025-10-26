import Link from "next/link";

import { events } from "@/lib/data";

export default function SafetyCenterPage() {
  const upcoming = events.filter((event) => event.status !== "Completed");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Safety Center</p>
        <h1 className="text-3xl font-semibold text-white">Waivers, compliance, and medical readiness</h1>
        <p className="max-w-3xl text-sm text-white/60">
          Keep every friendly bout accountable with digital waivers, pre-fight equipment checks, and post-event incident tracking.
          Use these tools to verify participation requirements before anyone steps in the cage.
        </p>
      </header>

      <section id="waiver" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="card space-y-4 p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Digital waiver workflow</h2>
              <p className="text-xs text-white/50">Sign once per event to unlock check-in and scoring access.</p>
            </div>
            <span className="rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Required</span>
          </header>
          <ol className="space-y-3 text-sm text-white/70">
            <li className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">1. Fighters receive a waiver link after accepting a matchup.</li>
            <li className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">2. Identity is verified with selfie upload and emergency contact confirmation.</li>
            <li className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">3. Organizers receive a time-stamped PDF copy and checklist update.</li>
          </ol>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white/70">
            <p className="text-xs uppercase tracking-wide text-white/40">Need signatures?</p>
            <p>Share your next event&apos;s waiver portal or print paper copies for offline backup.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
              <Link href="/events" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-glow">
                Open events list
              </Link>
              <a
                href="/downloads/waiver-template.pdf"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-white/70 transition hover:text-white"
                download
              >
                Download blank waiver
              </a>
            </div>
          </div>
        </article>
        <aside className="space-y-4">
          <section className="card space-y-3 p-5 text-sm text-white/70">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Upcoming sign-offs</h3>
            <ul className="space-y-3">
              {upcoming.map((event) => (
                <li key={event.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="text-xs text-white/40">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
                  <p className="text-xs text-white/50">Waiver required: {event.waiverRequired ? "Yes" : "No"}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="card space-y-3 p-5 text-sm text-white/70">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Incident resources</h3>
            <p>Run a post-bout health check and notify medics with the built-in incident form.</p>
            <Link href="/reports" className="inline-flex text-xs font-semibold uppercase tracking-wide text-primary">
              Open incident reports
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
