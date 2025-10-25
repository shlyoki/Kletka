import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { User } from "@/lib/types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <article className="card space-y-4 p-6">
      <header className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/30" />
        <div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-xs uppercase tracking-wide text-white/40">{user.role}</p>
        </div>
        {user.verified && <ShieldCheckIcon className="ml-auto h-5 w-5 text-emerald-400" />}
      </header>
      {user.nickname && (
        <p className="text-sm text-white/60">
          Nickname: <span className="text-white">{user.nickname}</span>
        </p>
      )}
      {user.weightClass && (
        <p className="text-sm text-white/60">
          Weight class: <span className="text-white">{user.weightClass}</span>
        </p>
      )}
      {user.record && (
        <p className="text-sm text-white/60">
          Record: <span className="text-white">{user.record.wins}-{user.record.losses}-{user.record.draws}</span>
        </p>
      )}
      {user.preferredRuleset && (
        <p className="text-sm text-white/60">
          Preferred ruleset: <span className="text-white">{user.preferredRuleset}</span>
        </p>
      )}
      {user.gym && (
        <p className="text-sm text-white/60">
          Training out of <span className="text-white">{user.gym}</span>
        </p>
      )}
      <footer className="flex flex-wrap items-center gap-2 text-xs text-white/50">
        {user.emergencyContact && (
          <span className="badge bg-white/10 text-white/70">Emergency contact secured</span>
        )}
        {user.medicalNotes && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-amber-200">
            <SparklesIcon className="h-4 w-4" />
            Medical reviewed (organizer only)
          </span>
        )}
      </footer>
    </article>
  );
}
