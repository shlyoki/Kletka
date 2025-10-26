"use client";

import { EventCard } from "@/components/event-card";
import { events } from "@/lib/data";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["All", "Published", "Live", "Draft", "Completed"] as const;
type FilterOption = (typeof filters)[number];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All") {
      return events;
    }

    return events.filter((event) => event.status === activeFilter);
  }, [activeFilter]);

  const hasResults = filteredEvents.length > 0;

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
          {filters.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={
                  isActive
                    ? "rounded-full bg-primary/20 px-4 py-2 text-primary shadow-glow"
                    : "rounded-full border border-white/10 px-4 py-2 transition hover:border-primary/40 hover:text-white"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>
      </header>
      {hasResults ? (
        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-12 text-center text-sm text-white/60">
          <p className="text-base font-semibold text-white">No events match this status just yet.</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-white/40">
            Try publishing a new card or adjusting the filters above.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-6 py-5 text-sm text-white/60 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(0,0,0,0.45)] animate-float-medium">
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
