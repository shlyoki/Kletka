import { EventCard } from "@/components/event-card";
import { NotificationList } from "@/components/notification-list";
import { events, notifications, bouts } from "@/lib/data";
import Link from "next/link";
import { BoutCard } from "@/components/bout-card";

export default function HomePage() {
  const upcoming = events.filter((event) => event.status !== "Completed");
  const confirmedBouts = bouts.filter((bout) => bout.status === "Confirmed");

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60" />
          <img src="https://images.unsplash.com/photo-1602192106324-6e332fd33010?auto=format&fit=crop&w=1200&q=80" alt="Fight night" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h2 className="text-3xl font-bold uppercase tracking-[0.3em] text-white">MFL</h2>
            <p className="text-sm text-white/70">Organize safe, friendly combat-sport events with digital waivers, real-time scoring, and private invites.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/create-event" className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
                Create event
              </Link>
              <Link href="/matchmaking" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                Find matchups
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Upcoming Events</h2>
          <Link href="/events" className="text-xs uppercase tracking-wide text-primary">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h2 className="section-title">Confirmed Bouts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {confirmedBouts.map((bout) => (
              <BoutCard key={bout.id} bout={bout} />
            ))}
            {confirmedBouts.length === 0 && (
              <p className="text-sm text-white/60">No bouts confirmed yet. Start matching fighters to populate your card.</p>
            )}
          </div>
        </div>
        <NotificationList notifications={notifications} />
      </section>
    </div>
  );
}
