import { EventCard } from "@/components/event-card";
import { events } from "@/lib/data";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Events</h1>
          <p className="text-sm text-white/60">Draft, publish, and manage your fight nights with built-in waivers and QR check-in.</p>
        </div>
        <Link href="/create-event" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
          New event
        </Link>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
    </div>
  );
}
