import type { Scorecard } from "@/lib/types";

interface ScorecardTableProps {
  scores: Scorecard[];
}

export function ScorecardTable({ scores }: ScorecardTableProps) {
  const grouped = scores.reduce<Record<number, Scorecard[]>>((acc, score) => {
    acc[score.round] ??= [];
    acc[score.round].push(score);
    return acc;
  }, {});

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
          <tr>
            <th className="px-4 py-3 text-left">Round</th>
            <th className="px-4 py-3 text-left">Judge</th>
            <th className="px-4 py-3 text-left">Red</th>
            <th className="px-4 py-3 text-left">Blue</th>
            <th className="px-4 py-3 text-left">Fouls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-surface-muted/50">
          {Object.entries(grouped).map(([round, entries]) =>
            entries.map((entry, idx) => (
              <tr key={`${round}-${idx}`} className="text-white/70">
                {idx === 0 && (
                  <td className="px-4 py-3" rowSpan={entries.length}>
                    <span className="badge">Round {round}</span>
                  </td>
                )}
                <td className="px-4 py-3">Judge {entry.judgeId}</td>
                <td className="px-4 py-3 font-semibold text-red-300">{entry.red}</td>
                <td className="px-4 py-3 font-semibold text-blue-300">{entry.blue}</td>
                <td className="px-4 py-3 text-xs">{entry.fouls ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
