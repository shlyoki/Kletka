"use client";

<<<<<<< HEAD
import Link from "next/link";
=======
>>>>>>> origin/main
import { useMemo, useState } from "react";
import { MatchmakingFilter } from "@/components/matchmaking-filter";
import { BoutCard } from "@/components/bout-card";
import { bouts, users } from "@/lib/data";
import type { Bout, User } from "@/lib/types";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Candidate extends User {
  availability: string;
}

const fighters: Candidate[] = users
  .filter((user): user is User & { role: "fighter" } => user.role === "fighter")
  .map((fighter, index) => ({ ...fighter, availability: index % 2 === 0 ? "Weeknights" : "Weekends" }));

export default function MatchmakingPage() {
  const [filters, setFilters] = useState({ weight: "Lightweight", experience: "Intermediate", ruleset: "MMA" });

  const candidates = useMemo(
    () =>
      fighters.filter(
        (fighter) =>
          (!fighter.weightClass || fighter.weightClass === filters.weight) &&
          fighter.experienceLevel === filters.experience &&
          fighter.preferredRuleset === filters.ruleset
      ),
    [filters]
  );

  const suggestedBouts = useMemo(
    () =>
      bouts.filter(
        (bout) =>
          bout.weightClass === filters.weight &&
          bout.ruleset === filters.ruleset &&
          (filters.experience === "Advanced" ? bout.rounds >= 3 : true)
      ),
    [filters]
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Matchmaking</h1>
        <p className="text-sm text-white/60">Pair fighters by weight, experience, and availability. Overrides require dual consent.</p>
      </header>
      <MatchmakingFilter onFilterChange={setFilters} />
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h2 className="section-title">Suggested Bouts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedBouts.map((bout: Bout) => (
              <BoutCard key={bout.id} bout={bout} />
            ))}
            {suggestedBouts.length === 0 && (
              <p className="text-sm text-white/60">No suggested bouts. Adjust filters or manually propose a matchup.</p>
            )}
          </div>
        </div>
        <aside className="card space-y-4 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Eligible fighters</h2>
          <ul className="space-y-3 text-sm text-white/70">
            {candidates.map((fighter) => (
              <li key={fighter.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface-muted/60 px-4 py-3">
                <UserCircleIcon className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-white">{fighter.name}</p>
                  <p className="text-xs text-white/50">
                    {fighter.weightClass} • {fighter.experienceLevel} • {fighter.availability}
                  </p>
                </div>
<<<<<<< HEAD
                <Link
                  href={`/matchmaking/offer/${fighter.id}`}
                  className="text-xs font-semibold uppercase tracking-wide text-primary transition hover:text-primary/80"
                >
                  Offer bout
                </Link>
=======
                <button className="text-xs uppercase tracking-wide text-primary">Offer bout</button>
>>>>>>> origin/main
              </li>
            ))}
            {candidates.length === 0 && <p className="text-xs text-white/50">No fighters fit all filters. Try widening criteria.</p>}
          </ul>
        </aside>
      </section>
    </div>
  );
}
