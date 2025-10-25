import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon, TicketIcon } from "@heroicons/react/24/outline";
import type { Event } from "@/lib/types";
import { clsx } from "clsx";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
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
    </article>
  );
}
