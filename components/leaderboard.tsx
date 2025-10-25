import type { Ruleset, User } from "@/lib/types";

interface LeaderboardEntry {
  fighter: User;
  rating: number;
  streak: string;
}

interface LeaderboardProps {
  ruleset: Ruleset;
  entries: LeaderboardEntry[];
}

export function Leaderboard({ ruleset, entries }: LeaderboardProps) {
  return (
    <section className="card overflow-hidden">
      <header className="border-b border-white/5 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">{ruleset} Leaderboard</h2>
      </header>
      <ol className="divide-y divide-white/5 bg-surface-muted/40 text-sm">
        {entries.map((entry, index) => (
          <li key={entry.fighter.id} className="flex items-center gap-4 px-5 py-3">
            <span className="text-lg font-bold text-primary/80">#{index + 1}</span>
            <div className="flex-1">
              <p className="font-semibold text-white">{entry.fighter.name}</p>
              <p className="text-xs text-white/50">
                {entry.fighter.weightClass} • {entry.fighter.experienceLevel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary">{entry.rating.toFixed(0)} ELO</p>
              <p className="text-xs text-emerald-300/70">{entry.streak}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
