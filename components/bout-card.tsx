import Link from "next/link";
import { FlagIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import type { Bout } from "@/lib/types";
import { users } from "@/lib/data";

interface BoutCardProps {
  bout: Bout;
}

export function BoutCard({ bout }: BoutCardProps) {
  const red = users.find((u) => u.id === bout.redFighterId);
  const blue = users.find((u) => u.id === bout.blueFighterId);
<<<<<<< HEAD
  const animationDelay = (bout.order % 5) * 0.3;

  return (
    <article
      className="card p-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(0,0,0,0.45)] animate-float-slow"
      style={{ animationDelay: `${animationDelay}s` }}
    >
=======

  return (
    <article className="card p-5">
>>>>>>> origin/main
      <header className="flex items-center justify-between text-xs text-white/50">
        <span className="badge">{bout.ruleset}</span>
        <span>Order #{bout.order}</span>
      </header>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-red-300/70">Red Corner</span>
            <span className="text-base font-semibold text-white">{red?.name ?? "TBD"}</span>
          </div>
          <span className="text-xs text-white/50">vs</span>
          <div className="flex flex-col text-right">
            <span className="text-xs uppercase text-blue-300/70">Blue Corner</span>
            <span className="text-base font-semibold text-white">{blue?.name ?? "TBD"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
          <p>Weight: {bout.weightClass}</p>
          <p>
            Rounds: {bout.rounds} × {bout.roundLength} min
          </p>
          <p className="flex items-center gap-2">
            <FlagIcon className="h-4 w-4" /> Status: {bout.status}
          </p>
          <p className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4" /> Judges: {bout.judges.length}
          </p>
        </div>
        {bout.notes && <p className="text-xs text-white/50">{bout.notes}</p>}
      </div>
      <footer className="mt-5 flex items-center justify-between text-xs text-primary">
        <Link href={`/bouts/${bout.id}`}>Open bout</Link>
        <Link href={`/events/${bout.eventId}`} className="text-white/60 hover:text-white">
          View event
        </Link>
      </footer>
    </article>
  );
}
