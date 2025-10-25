import { Leaderboard } from "@/components/leaderboard";
import { users } from "@/lib/data";

const mmaEntries = users
  .filter((user) => user.role === "fighter")
  .slice(0, 3)
  .map((fighter, index) => ({ fighter, rating: 1520 + index * 25, streak: index === 0 ? "W4" : index === 1 ? "W2" : "L1" }));

const grapplingEntries = users
  .filter((user) => user.role === "fighter")
  .slice(0, 3)
  .map((fighter, index) => ({ fighter, rating: 1490 + index * 18, streak: index === 0 ? "W3" : index === 1 ? "W1" : "L2" }));

export default function LeaderboardsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Leaderboards</h1>
        <p className="text-sm text-white/60">Friendly ELO rankings per ruleset. Only organizers see medical or waiver details.</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <Leaderboard ruleset="MMA" entries={mmaEntries} />
        <Leaderboard ruleset="Grappling" entries={grapplingEntries} />
      </section>
    </div>
  );
}
