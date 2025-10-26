import { notFound } from "next/navigation";
import { bouts, scorecards, users } from "@/lib/data";
import { ScorecardTable } from "@/components/scorecard-table";
import { WaiverStatus } from "@/components/waiver-status";
import { ChatThread } from "@/components/chat-thread";

interface BoutPageProps {
  params: { id: string };
}

export default function BoutPage({ params }: BoutPageProps) {
  const bout = bouts.find((entry) => entry.id === params.id);
  if (!bout) return notFound();

  const red = users.find((user) => user.id === bout.redFighterId);
  const blue = users.find((user) => user.id === bout.blueFighterId);
  const judgeNames = bout.judges.map((id) => users.find((user) => user.id === id)?.name ?? id).join(", ");
  const boutScores = scorecards.filter((score) => score.boutId === bout.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="card space-y-6 p-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/40">Bout #{bout.order} • {bout.ruleset}</p>
          <h1 className="text-2xl font-semibold text-white">{red?.name ?? "Red"} vs {blue?.name ?? "Blue"}</h1>
          <p className="text-sm text-white/60">Judges: {judgeNames}</p>
        </header>
        <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
          <div>
            <h2 className="text-xs uppercase text-white/40">Rounds</h2>
            <p>
              {bout.rounds} × {bout.roundLength} min
            </p>
          </div>
          <div>
            <h2 className="text-xs uppercase text-white/40">Weight class</h2>
            <p>{bout.weightClass}</p>
          </div>
          <div>
            <h2 className="text-xs uppercase text-white/40">Status</h2>
            <p>{bout.status}</p>
          </div>
          <div>
            <h2 className="text-xs uppercase text-white/40">Method</h2>
            <p>{bout.method ?? "TBD"}</p>
          </div>
        </div>
        <ScorecardTable scores={boutScores} />
        <div className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4 text-sm text-white/70">
          <h2 className="text-xs uppercase text-white/40">Post-fight summary</h2>
          <p>
            {bout.result
              ? `${bout.result === "Red" ? red?.name : blue?.name} wins via ${bout.method}. Records updated and leaderboard recalculated.`
              : "Awaiting score submission. All judges must complete the 10-point must card for each round."}
          </p>
        </div>
      </section>
      <aside className="space-y-4">
        <WaiverStatus signed={true} signedAt="2024-03-20T16:00:00Z" />
        <ChatThread
          title="Bout coordination"
          participants={[red?.name ?? "Red", blue?.name ?? "Blue", "Organizer"]}
          messages={[
            { id: "m1", sender: "Organizer", body: "Reminder: headgear optional, but mouthguards mandatory.", createdAt: "2024-03-20T09:00:00Z" },
            { id: "m2", sender: red?.name ?? "Red", body: "All good on medicals, see you at check-in.", createdAt: "2024-03-20T10:05:00Z" }
          ]}
          placeholder="Share weigh-in updates"
        />
      </aside>
    </div>
  );
}
