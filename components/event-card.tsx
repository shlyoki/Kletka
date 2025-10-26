import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon, TicketIcon } from "@heroicons/react/24/outline";
import type { Event } from "@/lib/types";
import clsx from "clsx";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const numericId = Number.parseInt(event.id.replace(/[^0-9]/g, "")) || 0;
  const animationDelay = (numericId % 5) * 0.4;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <article
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,59,48,0.4),rgba(17,18,28,0.9))] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.45)] animate-float-medium"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">{event.visibility}</p>
            <h3 className="mt-1 text-xl font-semibold text-white transition-colors group-hover:text-primary">{event.title}</h3>
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
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 font-semibold text-white transition group-hover:border-primary/40 group-hover:text-primary">
            View fight card
          </span>
        </footer>
      </article>
    </Link>
  );
}
