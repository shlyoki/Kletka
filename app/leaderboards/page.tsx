import { Leaderboard } from "@/components/leaderboard";
import { users } from "@/lib/data";

const fighters = users.filter((user) => user.role === "fighter");

const leaderboardEntries = fighters.map((fighter, index) => ({
  fighter,
  rating: 1550 - index * 12,
  winRate: Math.round((fighter.winRate ?? 0.6) * 100),
  finishes: fighter.finishes ?? 0,
  streak: index === 0 ? "W5" : index === 1 ? "W3" : index === 2 ? "W2" : "W1"
}));

const stats = [
  { label: "Active Winners", value: 5 },
  { label: "Total KOs", value: 17 },
  { label: "Total Subs", value: 15 },
  { label: "Total Bouts", value: 60 }
];

export default function LeaderboardsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Leaderboard</h1>
        <p className="muted-subtitle max-w-2xl">
          Track friendly rankings across the league. Results update automatically after judges submit scorecards and organizers confirm bouts.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
            <p className="text-xs uppercase tracking-wide text-white/40">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </section>
      <Leaderboard title="All Weight Classes" entries={leaderboardEntries} />
    </div>
  );
}
