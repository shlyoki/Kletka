import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FighterGrowthChart } from '@/components/fighter-growth-chart';
import { FighterAttributeRadar } from '@/components/fighter-attribute-radar';

interface FighterDetailPageProps {
  params: { id: string };
}

type Bout = {
  id: string;
  date: Date;
  weightClass: string;
  result: string;
  method: string;
  round: number;
  time: string;
  redFighterId: string;
  blueFighterId: string;
};

function computeOutcome(fighterId: string, bout: Bout) {
  const isRed = bout.redFighterId === fighterId;
  if (bout.result === 'DRAW') return 'Draw';
  if (bout.result === 'NC') return 'No contest';
  if (bout.result === 'RED') return isRed ? 'Win' : 'Loss';
  if (bout.result === 'BLUE') return isRed ? 'Loss' : 'Win';
  return 'No contest';
}

export default async function FighterDetailPage({ params }: FighterDetailPageProps) {
  const fighter = await prisma.fighterProfile.findUnique({
    where: { userId: params.id },
    include: {
      user: true,
      boutsRed: { orderBy: { date: 'desc' } },
      boutsBlue: { orderBy: { date: 'desc' } },
    },
  });

  if (!fighter) {
    return notFound();
  }

  const bouts = [...fighter.boutsRed, ...fighter.boutsBlue].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  let wins = 0;
  let losses = 0;
  let draws = 0;
  const weightClassBreakdown = new Map<string, { wins: number; losses: number; draws: number }>();
  const methodBreakdown = new Map<string, number>();
  const processedBouts = bouts.map((bout) => {
    const outcome = computeOutcome(fighter.userId, bout as Bout);
    if (outcome === 'Win') wins += 1;
    else if (outcome === 'Loss') losses += 1;
    else draws += 1;

    const bucket = weightClassBreakdown.get(bout.weightClass) ?? { wins: 0, losses: 0, draws: 0 };
    if (outcome === 'Win') bucket.wins += 1;
    else if (outcome === 'Loss') bucket.losses += 1;
    else bucket.draws += 1;
    weightClassBreakdown.set(bout.weightClass, bucket);

    if (outcome === 'Win' && bout.method !== 'DEC') {
      methodBreakdown.set(bout.method, (methodBreakdown.get(bout.method) ?? 0) + 1);
    }

    return {
      id: bout.id,
      date: bout.date,
      weightClass: bout.weightClass,
      outcome,
      method: bout.method,
      time: `R${bout.round} • ${bout.time}`,
    };
  });

  const recentBouts = processedBouts.slice(0, 5);
  const recordSummary = `${fighter.recordW}-${fighter.recordL}-${fighter.recordD}`;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-[32px] border border-white/10 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,59,48,0.35),rgba(16,16,24,0.95))] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">{fighter.weightClass}</p>
              <h1 className="text-3xl font-semibold text-white">{fighter.user?.name ?? 'Fighter'}</h1>
              {fighter.nickname && <p className="text-sm text-white/60">“{fighter.nickname}”</p>}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-right text-xs uppercase tracking-wide text-white/60">
              <p>Record</p>
              <p className="text-xl font-semibold text-white">{recordSummary}</p>
            </div>
          </header>
          <div className="mt-6 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            {fighter.bio && (
              <p className="rounded-2xl bg-white/5 px-4 py-3 text-white/80">{fighter.bio}</p>
            )}
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs uppercase text-white/50">Gym</p>
              <p className="text-white">{fighter.gym ?? 'Independent'}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs uppercase text-white/50">Region</p>
              <p className="text-white">{fighter.region ?? '—'}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs uppercase text-white/50">Stance</p>
              <p className="text-white">{fighter.stance ?? '—'}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs uppercase text-white/50">Height / Reach</p>
              <p className="text-white">
                {fighter.heightCm ? `${fighter.heightCm}cm` : '—'} • {fighter.reachCm ? `${fighter.reachCm}cm` : '—'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-xs uppercase text-white/50">Walkout music</p>
              <p className="text-white">{fighter.walkoutSong ?? 'Pick hype track'}</p>
            </div>
            {fighter.socials?.instagram && (
              <div className="rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-xs uppercase text-white/50">Instagram</p>
                <Link href={`https://instagram.com/${fighter.socials.instagram.replace('@', '')}`} className="text-primary">
                  {fighter.socials.instagram}
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/40">
            <span className="badge">Age {fighter.age ?? '—'}</span>
            <span className="badge">{wins} Wins</span>
            <span className="badge">{losses} Losses</span>
            <span className="badge">{draws} Draws</span>
          </div>
        </article>
        <FighterAttributeRadar attributes={fighter.attributes ?? null} />
      </section>
      <FighterGrowthChart fighterId={fighter.userId} />
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_24px_55px_rgba(0,0,0,0.35)]">
          <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
            <span>Recent bouts</span>
            <Link href="/events" className="text-primary">
              View events
            </Link>
          </header>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {recentBouts.length === 0 && <li>No bouts recorded yet.</li>}
            {recentBouts.map((bout) => (
              <li key={bout.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/40">
                  <span>{new Date(bout.date).toLocaleDateString()}</span>
                  <span>{bout.weightClass}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-white">
                  <p className="font-semibold">{bout.outcome}</p>
                  <p className="text-xs text-white/60">{bout.method} • {bout.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <header className="text-xs uppercase tracking-wide text-white/50">Record by weight class</header>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {Array.from(weightClassBreakdown.entries()).map(([weightClass, record]) => (
                <li key={weightClass} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2">
                  <span>{weightClass}</span>
                  <span className="font-semibold text-white">
                    {record.wins}-{record.losses}-{record.draws}
                  </span>
                </li>
              ))}
              {weightClassBreakdown.size === 0 && <li>No competitive history logged yet.</li>}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <header className="text-xs uppercase tracking-wide text-white/50">Finish methods</header>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {Array.from(methodBreakdown.entries()).map(([method, count]) => (
                <li key={method} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2">
                  <span>{method}</span>
                  <span className="font-semibold text-white">{count}</span>
                </li>
              ))}
              {methodBreakdown.size === 0 && <li>No finish data captured.</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
