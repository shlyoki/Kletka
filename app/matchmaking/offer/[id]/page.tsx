import Link from "next/link";
import { notFound } from "next/navigation";

import { bouts, events, users } from "@/lib/data";
import type { Event, User } from "@/lib/types";

interface OfferMatchPageProps {
  params: {
    id: string;
  };
}

export default function OfferMatchPage({ params }: OfferMatchPageProps) {
  const fighter = users.find((user) => user.id === params.id && user.role === "fighter");

  if (!fighter) {
    notFound();
  }

  const fighterIndex = users.findIndex((user) => user.id === fighter!.id);
  const availability = fighterIndex % 2 === 0 ? "Weeknights" : "Weekends";

  const compatibleOpponents = users
    .filter((user): user is User & { role: "fighter" } => user.role === "fighter" && user.id !== fighter!.id)
    .filter((opponent) => opponent.weightClass === fighter!.weightClass && opponent.experienceLevel === fighter!.experienceLevel)
    .slice(0, 3);

  const upcomingEvents = events.filter((event: Event) => event.status !== "Completed");
  const matchingEvents = upcomingEvents.filter((event) => event.rulesetDefault === fighter!.preferredRuleset);

  const existingBout = bouts.find(
    (bout) => bout.redFighterId === fighter!.id || bout.blueFighterId === fighter!.id
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Matchmaking</p>
        <h1 className="text-3xl font-semibold text-white">Offer {fighter!.name} a matchup</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Review the fighter&apos;s vitals, confirm waiver status, and pick an event slot before sending the offer. Both corners will
          need to accept inside the app before the bout is locked.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="card space-y-6 p-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Fighter profile</p>
              <h2 className="text-2xl font-semibold text-white">{fighter!.nickname ? `“${fighter!.nickname}”` : fighter!.name}</h2>
            </div>
            <span className="rounded-full bg-primary/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {fighter!.experienceLevel}
            </span>
          </header>
          <dl className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Weight class</dt>
              <dd className="text-lg font-semibold text-white">{fighter!.weightClass ?? "—"}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Record</dt>
              <dd className="text-lg font-semibold text-white">
                {fighter!.record ? `${fighter!.record.wins}-${fighter!.record.losses}-${fighter!.record.draws}` : "Debut"}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Preferred ruleset</dt>
              <dd className="text-lg font-semibold text-white">{fighter!.preferredRuleset}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-white/40">Availability</dt>
              <dd className="text-lg font-semibold text-white">{availability}</dd>
            </div>
          </dl>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-5 text-sm text-white/70">
            <p className="text-xs uppercase tracking-wide text-white/40">Safety & compliance</p>
            <ul className="mt-3 space-y-2">
              <li>• Medical notes visible to assigned organizers only.</li>
              <li>• Emergency contact verified in last 30 days.</li>
              <li>• Digital waiver required before check-in.</li>
            </ul>
            <Link href="/safety" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Review safety center
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/40">Send offer</p>
            <p className="mt-2 text-sm text-white/60">
              Choose an event slot and notify both camps. We&apos;ll log the consent trail once everyone responds.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
              <Link
                href={`/messages?thread=${fighter!.id}`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-glow"
              >
                Message fighters
              </Link>
              <Link
                href="/matchmaking"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-white/70 transition hover:text-white"
              >
                Back to list
              </Link>
            </div>
          </div>
        </article>
        <aside className="space-y-6">
          <section className="card space-y-4 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Compatible opponents</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {compatibleOpponents.length > 0 ? (
                compatibleOpponents.map((opponent) => (
                  <li key={opponent.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
                    <p className="font-semibold text-white">{opponent.name}</p>
                    <p className="text-xs text-white/40">
                      {opponent.record ? `${opponent.record.wins}-${opponent.record.losses}-${opponent.record.draws}` : "Debut"} •
                      {" "}
                      {opponent.preferredRuleset}
                    </p>
                    <Link
                      href={`/matchmaking/offer/${opponent.id}`}
                      className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wide text-primary"
                    >
                      Scout opponent
                    </Link>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-xs text-white/50">
                  No perfect matches yet. Try widening the filters or inviting new fighters to the card.
                </li>
              )}
            </ul>
          </section>
          <section className="card space-y-4 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Upcoming events</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {matchingEvents.length > 0 ? (
                matchingEvents.map((event) => (
                  <li key={event.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="text-xs text-white/40">
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} • {event.venue}
                    </p>
                    <Link href={`/events/${event.id}`} className="mt-2 inline-flex text-xs font-semibold uppercase tracking-wide text-primary">
                      Assign bout
                    </Link>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-xs text-white/50">
                  No published events match this fighter&apos;s preferred ruleset yet.
                </li>
              )}
            </ul>
          </section>
          {existingBout && (
            <section className="card space-y-3 p-5 text-sm text-white/70">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Current assignment</h3>
              <p>
                {fighter!.name} is penciled in for <span className="font-semibold text-white">Bout {existingBout.id}</span> at
                {" "}
                <Link href={`/events/${existingBout.eventId}`} className="text-primary">
                  {events.find((event) => event.id === existingBout.eventId)?.title ?? "the selected event"}
                </Link>
                . Update the matchup before sending a new offer.
              </p>
              <Link
                href={`/bouts/${existingBout.id}`}
                className="inline-flex text-xs font-semibold uppercase tracking-wide text-primary"
              >
                Review bout details
              </Link>
            </section>
          )}
        </aside>
      </section>
    </div>
  );
}
