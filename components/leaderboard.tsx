import type { User } from "@/lib/types";

interface LeaderboardEntry {
  fighter: User;
  rating: number;
  winRate: number;
  finishes: number;
  streak: string;
}

interface LeaderboardProps {
  title: string;
  entries: LeaderboardEntry[];
}

export function Leaderboard({ title, entries }: LeaderboardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/40">Rankings</p>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/50">
          Updated just now
        </span>
      </header>
      <div className="divide-y divide-white/5">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 text-xs uppercase tracking-wide text-white/40">
          <span>#</span>
          <span>Fighter</span>
          <span className="text-right">Record</span>
          <span className="text-right">Win %</span>
          <span className="text-right">Finishes</span>
          <span className="text-right">Streak</span>
        </div>
        {entries.map((entry, index) => (
          <div key={entry.fighter.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 text-sm text-white/80">
            <span className="text-lg font-bold text-primary/80">{index + 1}</span>
            <div>
              <p className="font-semibold text-white">{entry.fighter.name}</p>
              <p className="text-xs text-white/50">
                {entry.fighter.weightClass} • {entry.fighter.experienceLevel}
              </p>
            </div>
            <span className="text-right font-semibold text-white">
              {entry.fighter.record
                ? `${entry.fighter.record.wins}-${entry.fighter.record.losses}-${entry.fighter.record.draws}`
                : "--"}
            </span>
            <span className="text-right font-semibold text-white">{entry.winRate}%</span>
            <span className="text-right font-semibold text-white">{entry.finishes}</span>
            <span className="text-right text-emerald-300/80">{entry.streak}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
