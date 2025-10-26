import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon, TicketIcon } from "@heroicons/react/24/outline";
import type { Event } from "@/lib/types";
<<<<<<< HEAD
import clsx from "clsx";
=======
import { clsx } from "clsx";
>>>>>>> origin/main

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
<<<<<<< HEAD
  const numericId = Number.parseInt(event.id.replace(/[^0-9]/g, "")) || 0;
  const animationDelay = (numericId % 5) * 0.4;

  return (
    <article
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,59,48,0.4),rgba(17,18,28,0.9))] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.45)] animate-float-medium"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">{event.visibility}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{event.title}</h3>
        </div>
        <span
          className={clsx(
            "status-pill",
            event.status === "Live" && "bg-emerald-500/20 text-emerald-300",
            event.status === "Published" && "bg-primary/20 text-primary",
            event.status === "Draft" && "bg-white/10 text-white/60",
            event.status === "Completed" && "bg-white/10 text-white/40"
          )}
        >
          {event.status}
        </span>
      </div>
      <p className="mt-4 text-sm text-white/70">{event.description}</p>
      <dl className="mt-6 space-y-4 text-sm text-white/70">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="h-4 w-4 text-white/50" />
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Date & Time</dt>
            <dd>{new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} • {event.time}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPinIcon className="h-4 w-4 text-white/50" />
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Venue</dt>
            <dd>{event.venue}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TicketIcon className="h-4 w-4 text-white/50" />
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Entry</dt>
            <dd>{event.paid ? `$${event.price}` : "Free"}</dd>
          </div>
        </div>
      </dl>
      <footer className="mt-6 flex items-center justify-between text-xs text-white/60">
        <div className="space-y-1">
          <p>RSVP {event.attendees}/{event.rsvpLimit}</p>
          <p>Minimum age {event.minAge} • Waiver {event.waiverRequired ? "required" : "optional"}</p>
        </div>
        <Link href={`/events/${event.id}`} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20">
          Open
        </Link>
      </footer>
=======
  return (
    <article className="card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" aria-hidden />
      <div className="relative space-y-4 p-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50">{event.visibility}</p>
            <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          </div>
          <span
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase",
              event.status === "Published" && "bg-primary/20 text-primary",
              event.status === "Draft" && "bg-white/10 text-white/50",
              event.status === "Live" && "bg-secondary/20 text-secondary",
              event.status === "Completed" && "bg-white/10 text-white/60"
            )}
          >
            {event.status}
          </span>
        </header>
        <dl className="grid grid-cols-2 gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Date</dt>
              <dd>{new Date(event.date).toLocaleDateString()}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Venue</dt>
              <dd>{event.venue}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TicketIcon className="h-4 w-4" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-white/40">Entry</dt>
              <dd>{event.paid ? `$${event.price}` : "Free"}</dd>
            </div>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-white/40">Waiver</dt>
            <dd>{event.waiverRequired ? "Required" : "Optional"}</dd>
          </div>
        </dl>
        <p className="text-sm text-white/70">{event.description}</p>
        <footer className="flex items-center justify-between pt-2 text-xs text-white/50">
          <p>
            RSVPs {event.attendees}/{event.rsvpLimit} • Min age {event.minAge}
          </p>
          <Link href={`/events/${event.id}`} className="text-primary hover:text-primary/80">
            View details
          </Link>
        </footer>
      </div>
>>>>>>> origin/main
    </article>
  );
}
