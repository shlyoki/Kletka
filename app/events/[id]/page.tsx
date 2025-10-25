import { notFound } from "next/navigation";
import { bouts, events, scorecards, users } from "@/lib/data";
import { BoutCard } from "@/components/bout-card";
import { WaiverStatus } from "@/components/waiver-status";
import { Checklist } from "@/components/checklist";
import Link from "next/link";

interface EventPageProps {
  params: { id: string };
}

const equipmentChecklist = ["Mouthguard", "Gloves/Wraps", "Headgear (if required)", "No alcohol or drugs", "Signed waiver"];

export default function EventDetailPage({ params }: EventPageProps) {
  const event = events.find((entry) => entry.id === params.id);
  if (!event) return notFound();

  const organizer = users.find((user) => user.id === event.organizerId);
  const relatedBouts = bouts.filter((bout) => bout.eventId === event.id);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="card space-y-6 p-6">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-white/40">{event.visibility}</p>
            <h1 className="text-3xl font-semibold text-white">{event.title}</h1>
            <p className="text-sm text-white/60">{event.description}</p>
          </header>
          <dl className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-white/40">Date & time</dt>
              <dd>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Venue</dt>
              <dd>{event.venue}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Ruleset</dt>
              <dd>{event.rulesetDefault}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Organizer</dt>
              <dd>{organizer?.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Equipment</dt>
              <dd>{event.equipment.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">RSVPs</dt>
              <dd>
                {event.attendees}/{event.rsvpLimit} • {event.paid ? `Paid $${event.price}` : "Free"}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3 text-xs text-white/40">
            <span className="badge">Minimum age {event.minAge}</span>
            <span className="badge">QR check-in ready</span>
            <span className="badge">Digital waiver {event.waiverRequired ? "required" : "optional"}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/events/${event.id}/waiver`} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
              Open waiver
            </Link>
            <Link href={`/events/${event.id}/card`} className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
              Download card
            </Link>
          </div>
        </article>
        <div className="space-y-4">
          <WaiverStatus signed={true} signedAt="2024-03-15T18:30:00Z" />
          <Checklist title="Pre-bout checklist" items={equipmentChecklist} />
        </div>
      </section>
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="section-title">Fight Card</h2>
          <Link href={`/events/${event.id}/manage`} className="text-xs uppercase tracking-wide text-primary">
            Manage card
          </Link>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {relatedBouts.map((bout) => (
            <BoutCard key={bout.id} bout={bout} />
          ))}
          {relatedBouts.length === 0 && <p className="text-sm text-white/60">No bouts yet. Start matchmaking to populate this event.</p>}
        </div>
      </section>
      <section className="card space-y-4 p-6">
        <header>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Recent score submissions</h2>
          <p className="text-xs text-white/40">Automatic result calculation will update fighter records and leaderboards.</p>
        </header>
        <ul className="space-y-3 text-sm text-white/70">
          {scorecards
            .filter((score) => relatedBouts.some((bout) => bout.id === score.boutId))
            .map((score) => (
              <li key={`${score.boutId}-${score.round}-${score.judgeId}`} className="rounded-xl border border-white/5 bg-surface-muted/60 px-4 py-3">
                Judge {score.judgeId} submitted round {score.round} scores: Red {score.red} / Blue {score.blue}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
