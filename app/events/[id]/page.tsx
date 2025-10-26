import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BoutCard } from '@/components/bout-card';
import { WaiverStatus } from '@/components/waiver-status';
import { Checklist } from '@/components/checklist';
import { EventRating } from '@/components/event-rating';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { EventChat } from '@/components/event-chat';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

interface EventPageProps {
  params: { id: string };
}

const equipmentChecklist = [
  'Mouthguard',
  'Gloves/Wraps',
  'Headgear (if required)',
  'No alcohol or drugs',
  'Signed waiver',
];

export default async function EventDetailPage({ params }: EventPageProps) {
  const session = await auth();
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: true,
      waivers: true,
      bouts: {
        orderBy: { date: 'asc' },
        include: {
          redFighter: { include: { user: true } },
          blueFighter: { include: { user: true } },
        },
      },
    },
  });

  if (!event) {
    return notFound();
  }

  const isOrganizer = session?.user?.id === event.organizerId;
  const signedWaiver = event.waivers.find((waiver: { userId: string; signedAt?: Date }) => waiver.userId === session?.user?.id);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <article className="card space-y-6 p-6">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-white/40">{event.visibility}</p>
            <h1 className="text-3xl font-semibold text-white">{event.title}</h1>
            <p className="text-sm text-white/60">{event.description}</p>
          </header>
          <dl className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-white/40">Date & time</dt>
              <dd>{new Date(event.date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Venue</dt>
              <dd>{event.venue ?? 'TBA'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Ruleset</dt>
              <dd>{event.ruleset}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-white/40">Organizer</dt>
              <dd>{event.organizer?.name ?? 'Organizer'}</dd>
            </div>
          </dl>
          <div className="flex items-center justify-between gap-3">
            <EventRating eventId={event.id} />
            <div className="text-xs uppercase tracking-wide text-white/50">
              {event.waivers.length} attendees checked in
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-white/40">
            <span className="badge">QR check-in ready</span>
            <span className="badge">Digital waiver required</span>
            <span className="badge">Safe sparring protocols</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/events/${event.id}/waiver`}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
            >
              Open waiver
            </Link>
            {isOrganizer && (
              <Link
                href={`/events/${event.id}/card`}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70"
              >
                Download card
              </Link>
            )}
          </div>
        </article>
        <div className="space-y-4">
          <WaiverStatus signed={Boolean(signedWaiver)} signedAt={signedWaiver?.signedAt.toISOString()} />
          <Checklist title="Pre-bout checklist" items={equipmentChecklist} />
        </div>
      </section>
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="section-title">Fight Card</h2>
          {isOrganizer && (
            <Link href={`/events/${event.id}/manage`} className="text-xs uppercase tracking-wide text-primary">
              Manage card
            </Link>
          )}
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {event.bouts.map((bout: any) => (
            <BoutCard key={bout.id} bout={bout as any} />
          ))}
          {event.bouts.length === 0 && (
            <p className="text-sm text-white/60">No bouts yet. Start matchmaking to populate this event.</p>
          )}
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card space-y-4 p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Community feedback</h2>
              <p className="text-xs text-white/40">Reviews help organizers iterate on safety and experience.</p>
            </div>
          </header>
          <ReviewList
            eventId={event.id}
            allowModeration={isOrganizer}
            currentRole={session?.user?.role ?? Role.GUEST}
          />
        </div>
        <div className="card space-y-4 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Share your take</h3>
          {session?.user ? (
            <ReviewForm eventId={event.id} />
          ) : (
            <p className="text-sm text-white/60">Sign in to leave a review once you have attended the event.</p>
          )}
        </div>
      </section>
      <EventChat eventId={event.id} currentUser={session?.user ?? null} />
    </div>
  );
}
