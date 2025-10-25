"use client";

import { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

interface MatchmakingFilterProps {
  onFilterChange?: (filters: { weight: string; experience: string; ruleset: string }) => void;
}

const weightClasses = ["Flyweight", "Bantamweight", "Featherweight", "Lightweight", "Welterweight", "Middleweight"];
const experienceBands = ["Beginner", "Intermediate", "Advanced"];
const rulesets = ["MMA", "Kickboxing", "Boxing", "Grappling"];

export function MatchmakingFilter({ onFilterChange }: MatchmakingFilterProps) {
  const [filters, setFilters] = useState({ weight: "Lightweight", experience: "Intermediate", ruleset: "MMA" });

  function updateFilter(key: keyof typeof filters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange?.(next);
  }

  return (
    <section className="card space-y-4 p-5">
      <header className="flex items-center gap-2">
        <FunnelIcon className="h-5 w-5 text-white/60" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Matchmaking Filters</h2>
      </header>
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase text-white/40">Weight Class</span>
          <select
            className="rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            value={filters.weight}
            onChange={(event) => updateFilter("weight", event.target.value)}
          >
            {weightClasses.map((weight) => (
              <option key={weight}>{weight}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase text-white/40">Experience</span>
          <select
            className="rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            value={filters.experience}
            onChange={(event) => updateFilter("experience", event.target.value)}
          >
            {experienceBands.map((band) => (
              <option key={band}>{band}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase text-white/40">Ruleset</span>
          <select
            className="rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            value={filters.ruleset}
            onChange={(event) => updateFilter("ruleset", event.target.value)}
          >
            {rulesets.map((ruleset) => (
              <option key={ruleset}>{ruleset}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs text-white/50">
        Fighters must sign the digital waiver, pass the equipment check, and have organizer approval before appearing on the card.
      </p>
    </section>
  );
}
