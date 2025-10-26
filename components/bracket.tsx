import type { Bout } from "@/lib/types";
import { users } from "@/lib/data";

interface BracketProps {
  bouts: Bout[];
}

export function Bracket({ bouts }: BracketProps) {
  const ordered = [...bouts].sort((a, b) => a.order - b.order);
  return (
    <section className="card space-y-4 p-6">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Tournament Bracket</h2>
        <p className="text-xs text-white/50">Auto-advances winners and syncs with judge scoring in real time.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ordered.map((bout) => {
          const red = users.find((user) => user.id === bout.redFighterId)?.name ?? "TBD";
          const blue = users.find((user) => user.id === bout.blueFighterId)?.name ?? "TBD";
          return (
            <article key={bout.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4 text-sm text-white/70">
              <p className="text-xs uppercase text-white/40">Bout #{bout.order}</p>
              <p className="mt-2 font-semibold text-white">{red}</p>
              <p className="text-xs text-white/40">vs</p>
              <p className="font-semibold text-white">{blue}</p>
              <p className="mt-3 text-xs text-white/40">{bout.ruleset} • {bout.rounds} × {bout.roundLength} min</p>
              {bout.result && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  Winner: {bout.result === "Red" ? red : bout.result === "Blue" ? blue : "Draw"} ({bout.method})
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
