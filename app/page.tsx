import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { events, notifications, users } from "@/lib/data";

const quickActions = [
  {
    title: "Launch new card",
    description: "Set rules, bouts, and waivers in minutes.",
    href: "/create-event",
    icon: MegaphoneIcon
  },
  {
    title: "Match fighters",
    description: "Filter by class, record, and availability.",
    href: "/matchmaking",
    icon: UserGroupIcon
  },
  {
    title: "Safety checklist",
    description: "Lock participation until gear is cleared.",
    href: "/dashboard",
    icon: ShieldCheckIcon
  },
  {
    title: "Send update",
    description: "Push bout reminders and judge assignments.",
    href: "/messages",
    icon: ChatBubbleOvalLeftEllipsisIcon
  }
];

export default function HomePage() {
  const nextEvent = events[0];
  const otherEvents = events.slice(1);
  const topFighters = users
    .filter((user) => user.role === "fighter")
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 4);

  if (!nextEvent) {
    return (
      <div className="space-y-16">
        <section className="rounded-[32px] border border-white/10 bg-black/40 p-12 text-center shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
          <h1 className="text-3xl font-semibold text-white">Welcome to MMA Friends League</h1>
          <p className="mt-3 text-sm text-white/60">
            Start by creating an event to unlock matchmaking, safety workflows, and fighter leaderboards.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
            >
              Create first event
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const eventProgress = Math.min(100, Math.round((nextEvent.attendees / nextEvent.rsvpLimit) * 100));

  return (
    <div className="space-y-16">
      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(160%_120%_at_10%_10%,rgba(255,59,48,0.45),rgba(11,13,24,0.92))] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.25),transparent_55%)] mix-blend-screen" />
          <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-6">
              <span className="title-accent">Organizer Control Room</span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">MMA Friends League</h1>
                <p className="text-base text-white/70">
                  Coordinate friendly bouts, verify waivers, and deliver judge-ready scorecards. Keep every match safe while giving fighters a professional spotlight.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/create-event"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
                >
                  Schedule Event
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/leaderboards"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white/80"
                >
                  View Leaderboards
                </Link>
              </div>
            </div>
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
                <span>Next event</span>
                <span>{nextEvent.visibility}</span>
              </header>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-white/50">{new Date(nextEvent.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
                  <h2 className="text-xl font-semibold text-white">{nextEvent.title}</h2>
                  <p className="text-xs text-white/50">{nextEvent.venue}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                  <p className="text-xs uppercase tracking-wide text-white/40">Attendance</p>
                  <p className="text-lg font-semibold text-white">{nextEvent.attendees}/{nextEvent.rsvpLimit} RSVP</p>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-white/80" style={{ width: `${eventProgress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-white/50">{eventProgress}% capacity</p>
                </div>
                <Link
                  href={`/events/${nextEvent.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary/60 hover:text-primary"
                >
                  Manage card
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Compliance Snapshot</p>
                <h3 className="text-lg font-semibold text-white">Safety Pipeline</h3>
              </div>
              <CheckBadgeIcon className="h-6 w-6 text-emerald-400" />
            </header>
            <dl className="mt-6 space-y-4 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <dt>Waivers signed</dt>
                <dd className="text-emerald-300">100%</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <dt>Equipment cleared</dt>
                <dd className="text-emerald-300">12/12 bouts</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <dt>Medical holds</dt>
                <dd className="text-amber-300">1 follow-up</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-white/50">Lock-ins release 24 hours before first bell once all checks complete.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-wide text-white/40">Operations Tip</p>
            <h3 className="mt-2 text-lg font-semibold text-white">Share the fighter briefing</h3>
            <p className="mt-2 text-sm text-white/60">
              Send the bout-specific chat a final checklist two hours before call time to confirm hydration, wraps, and corners.
            </p>
            <Link href="/messages" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Jump to messages
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Control actions</h2>
            <p className="muted-subtitle">Quick links to manage fight nights, safety workflows, and communications.</p>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-6 transition hover:border-primary/50 hover:shadow-[0_25px_55px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(255,59,48,0.25),transparent)] opacity-0 transition group-hover:opacity-100" />
              <action.icon className="relative h-6 w-6 text-primary" />
              <div className="relative mt-6 space-y-2">
                <h3 className="text-base font-semibold text-white">{action.title}</h3>
                <p className="text-sm text-white/60">{action.description}</p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60 transition group-hover:text-white">
                Open
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Upcoming schedule</h2>
            <Link href="/events" className="text-xs font-semibold uppercase tracking-wide text-primary">
              View all events
            </Link>
          </header>
          <div className="space-y-4">
            {[nextEvent, ...otherEvents].map((event) => (
              <article key={event.id} className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.3)] transition hover:border-primary/40 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-white/40">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/60">{event.visibility}</span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-primary">{event.status}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <p className="text-sm text-white/60">{event.description}</p>
                  <div className="flex flex-wrap gap-5 text-xs text-white/50">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {event.time}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      {event.venue}
                    </span>
                    <span>{event.attendees}/{event.rsvpLimit} RSVPs</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-white/40">Ruleset</p>
                    <p className="text-sm font-semibold text-white">{event.rulesetDefault}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wide text-white/40">Waiver</p>
                    <p className="text-sm font-semibold text-white">{event.waiverRequired ? "Required" : "Optional"}</p>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
                  >
                    Manage
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-black/35 p-6 shadow-[0_25px_55px_rgba(0,0,0,0.35)]">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Fighter Spotlight</p>
                <h3 className="text-lg font-semibold text-white">League Rankings</h3>
              </div>
              <Link href="/leaderboards" className="text-xs font-semibold uppercase tracking-wide text-primary">
                Rankings
              </Link>
            </header>
            <ul className="mt-6 space-y-4">
              {topFighters.map((fighter, index) => (
                <li key={fighter.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/40">#{index + 1} {fighter.weightClass}</p>
                      <p className="text-sm font-semibold text-white">{fighter.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{Math.round((fighter.winRate ?? 0) * 100)}%</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">{fighter.gym}</p>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-400" style={{ width: `${Math.round((fighter.winRate ?? 0) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Recent Activity</p>
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
            </header>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              {notifications.slice(0, 4).map((notification) => (
                <li key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-medium text-white">{notification.message}</p>
                  <p className="text-xs uppercase tracking-wide text-white/40">{new Date(notification.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-black/35 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Waiver automation</p>
            <h2 className="text-2xl font-semibold text-white">Every participant signs in-app before stepping through check-in</h2>
            <p className="text-sm text-white/60">
              Export the full waiver log, capture digital signatures, and record emergency contacts in one tap. Compliance stays synced even when working offline at the venue entrance.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-primary/60 hover:text-primary"
          >
            Review waivers
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
