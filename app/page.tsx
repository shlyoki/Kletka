import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { events, users } from "@/lib/data";

export default function HomePage() {
  const upcoming = events;
  const topFighters = users
    .filter((user) => user.role === "fighter")
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 4);

  return (
    <div className="space-y-12">
      <section className="card card-emphasis overflow-hidden">
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <span className="title-accent">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
              Live Events Platform
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">MMA Friends League</h1>
              <p className="max-w-xl text-base text-white/70">
                Organize safe, competitive combat sports events among friends. Track records, manage matchups, and build your legacy with digital waivers and judge scoring.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
              >
                Browse Events
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/leaderboards"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white/80"
              >
                View Rankings
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">Event Safety Checklist</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Mouthguards & wraps</span>
                <span className="text-xs uppercase tracking-wide text-emerald-400">Cleared</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Digital waivers</span>
                <span className="text-xs uppercase tracking-wide text-emerald-400">100% Signed</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <span>Medical staff on call</span>
                <span className="text-xs uppercase tracking-wide text-amber-300">Scheduled</span>
              </li>
            </ul>
            <p className="mt-5 text-xs text-white/40">Pre-fight checks lock participation until complete.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Upcoming Events</h2>
            <Link href="/events" className="text-xs font-semibold uppercase tracking-wide text-primary">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcoming.map((event) => (
              <article key={event.id} className="rounded-3xl border border-white/5 bg-black/35 p-6 transition hover:border-primary/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`status-pill ${
                          event.status === "Live"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : event.status === "Published"
                              ? "bg-primary/20 text-primary"
                              : "bg-white/10 text-white/60"
                        }`}
                      >
                        {event.status}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-white/40">{event.visibility}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  </div>
                  <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
                    Manage
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
                <p className="mt-3 text-sm text-white/60">{event.description}</p>
                <div className="mt-4 flex flex-wrap gap-5 text-xs text-white/50">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {event.time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {event.venue}
                  </span>
                  <span>RSVP {event.attendees}/{event.rsvpLimit}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Top Fighters</p>
                <h3 className="text-lg font-semibold text-white">League Spotlight</h3>
              </div>
              <Link href="/leaderboards" className="text-xs font-semibold uppercase tracking-wide text-primary">
                Leaderboard
              </Link>
            </header>
            <ul className="mt-6 space-y-4">
              {topFighters.map((fighter, index) => (
                <li key={fighter.id} className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-xl font-bold text-primary/80">{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{fighter.name}</p>
                    <p className="text-xs text-white/50">
                      {fighter.weightClass} • {fighter.experienceLevel}
                    </p>
                  </div>
                  <div className="text-right text-xs text-white/60">
                    <p className="font-semibold text-white">{Math.round((fighter.winRate ?? 0) * 100)}%</p>
                    <p>Win rate</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-sm text-white/60">
            <p className="font-semibold text-white">Incident-free streak</p>
            <p className="mt-1 text-3xl font-bold text-white">62</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-white/40">Days since last reported injury</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
