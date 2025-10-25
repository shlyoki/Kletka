import { ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import type { User } from "@/lib/types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(140%_120%_at_0%_0%,rgba(255,59,48,0.35),rgba(16,16,24,0.95))] p-8 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold uppercase text-white">
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">{user.role}</p>
            <h3 className="text-2xl font-semibold text-white">{user.name}</h3>
            {user.nickname && <p className="text-sm text-white/60">“{user.nickname}”</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.verified && <ShieldCheckIcon className="h-6 w-6 text-emerald-400" />}
          <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20">
            Edit Profile
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-white/70 md:grid-cols-2">
        {user.weightClass && (
          <p className="rounded-2xl bg-white/5 px-4 py-3">
            Weight class <span className="block text-lg font-semibold text-white">{user.weightClass}</span>
          </p>
        )}
        {user.record && (
          <p className="rounded-2xl bg-white/5 px-4 py-3">
            Record <span className="block text-lg font-semibold text-white">{user.record.wins}-{user.record.losses}-{user.record.draws}</span>
          </p>
        )}
        {user.preferredRuleset && (
          <p className="rounded-2xl bg-white/5 px-4 py-3">
            Preferred ruleset <span className="block text-lg font-semibold text-white">{user.preferredRuleset}</span>
          </p>
        )}
        {user.gym && (
          <p className="rounded-2xl bg-white/5 px-4 py-3">
            Training out of <span className="block text-lg font-semibold text-white">{user.gym}</span>
          </p>
        )}
      </div>
      <footer className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/50">
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
