import { EventCard } from "@/components/event-card";
import { events } from "@/lib/data";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Events</h1>
          <p className="muted-subtitle max-w-2xl">
            Browse and join upcoming fight nights. Every event includes mandatory waivers, safety gear requirements, and live scoring workflows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-white/50">
          <span className="rounded-full bg-primary/20 px-4 py-2 text-primary">All</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Published</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Live</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Draft</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Completed</span>
        </div>
      </header>
      <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-6 py-5 text-sm text-white/60">
        <div>
          <p className="text-white">Need to announce a private card?</p>
          <p className="text-xs uppercase tracking-wide text-white/40">Share invite links with automatic waiver collection.</p>
        </div>
        <Link href="/create-event" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
          Create Event
        </Link>
      </div>
    </div>
  );
}
