import Link from 'next/link';
import { FlagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface FighterInfo {
  name?: string | null;
  nickname?: string | null;
}

interface BoutCardProps {
  bout: {
    id: string;
    eventId?: string | null;
    ruleset?: string | null;
    order?: number;
    weightClass?: string | null;
    rounds?: number | null;
    roundLength?: number | null;
    status?: string | null;
    notes?: string | null;
    judges?: unknown[];
    redFighter?: { user?: FighterInfo | null; nickname?: string | null } | null;
    blueFighter?: { user?: FighterInfo | null; nickname?: string | null } | null;
  };
}

export function BoutCard({ bout }: BoutCardProps) {
  const redName = bout.redFighter?.user?.name ?? bout.redFighter?.nickname ?? 'TBD';
  const blueName = bout.blueFighter?.user?.name ?? bout.blueFighter?.nickname ?? 'TBD';
  const animationDelay = ((bout.order ?? 0) % 5) * 0.3;

  return (
    <article
      className="card p-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(0,0,0,0.45)] animate-float-slow"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <header className="flex items-center justify-between text-xs text-white/50">
        <span className="badge">{bout.ruleset ?? 'Friendly rules'}</span>
        {bout.order && <span>Order #{bout.order}</span>}
      </header>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-red-300/70">Red Corner</span>
            <span className="text-base font-semibold text-white">{redName}</span>
          </div>
          <span className="text-xs text-white/50">vs</span>
          <div className="flex flex-col text-right">
            <span className="text-xs uppercase text-blue-300/70">Blue Corner</span>
            <span className="text-base font-semibold text-white">{blueName}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
          <p>Weight: {bout.weightClass ?? 'TBD'}</p>
          <p>
            Rounds: {bout.rounds ?? 3} × {bout.roundLength ?? 3} min
          </p>
          <p className="flex items-center gap-2">
            <FlagIcon className="h-4 w-4" /> Status: {bout.status ?? 'Scheduled'}
          </p>
          <p className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" /> Judges: {bout.judges ? bout.judges.length : 3}
          </p>
        </div>
        {bout.notes && <p className="text-xs text-white/50">{bout.notes}</p>}
      </div>
      <footer className="mt-5 flex items-center justify-between text-xs text-primary">
        <Link href={`/bouts/${bout.id}`}>Open bout</Link>
        {bout.eventId && (
          <Link href={`/events/${bout.eventId}`} className="text-white/60 hover:text-white">
            View event
          </Link>
        )}
      </footer>
    </article>
  );
}
