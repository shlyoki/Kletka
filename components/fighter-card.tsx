import Link from 'next/link';
import type { User } from '@/lib/types';

interface FighterCardProps {
  fighter: User;
}

export function FighterCard({ fighter }: FighterCardProps) {
  const winRate = fighter.winRate ? Math.round(fighter.winRate * 100) : undefined;
  const record = fighter.record
    ? `${fighter.record.wins}-${fighter.record.losses}-${fighter.record.draws}`
    : undefined;
  const numericId = Number.parseInt(fighter.id.replace(/[^0-9]/g, '')) || 0;
  const animationDelay = (numericId % 6) * 0.35;

  return (
    <Link
      href={`/fighters/${fighter.id}`}
      className="relative block overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,59,48,0.35),rgba(16,16,24,0.95))] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(0,0,0,0.45)] animate-float-slow"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">{fighter.weightClass}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{fighter.name}</h3>
          {fighter.nickname && <p className="text-xs uppercase tracking-wider text-white/40">“{fighter.nickname}”</p>}
        </div>
        <span className="status-pill bg-emerald-500/20 text-emerald-300">{fighter.statusTag ?? 'Active'}</span>
      </div>
      <div className="mt-5 grid gap-4 text-sm text-white/70">
        {record && (
          <p className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2">
            <span>Record</span>
            <span className="font-semibold text-white">{record}</span>
          </p>
        )}
        <p className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2">
          <span>Experience</span>
          <span className="font-semibold text-white">{fighter.experienceLevel}</span>
        </p>
        <p className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2">
          <span>Preferred ruleset</span>
          <span className="font-semibold text-white">{fighter.preferredRuleset}</span>
        </p>
      </div>
      <footer className="mt-6 flex items-center justify-between text-xs text-white/50">
        <div>
          {winRate !== undefined && <p className="font-semibold text-white">{winRate}% win rate</p>}
          {fighter.knockouts !== undefined && <p>{fighter.knockouts} KOs • {fighter.finishes ?? 0} finishes</p>}
        </div>
        <p className="rounded-full bg-white/10 px-3 py-1 text-white/70">{fighter.gym}</p>
      </footer>
    </Link>
  );
}
