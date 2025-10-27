import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';
import { listUsers } from '@/lib/user-store';
import { MembersClient } from './members-client';

export default async function MembersPage() {
  const session = await auth();
  if (!session.user) {
    redirect('/login');
  }
  if (!session.user.isOwner) {
    redirect('/');
  }

  const users = await listUsers();
  const serialized = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    onboarded: Boolean(user.onboarded),
    isOwner: Boolean(user.isOwner),
    createdAt: user.createdAt,
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Member management</h1>
        <p className="text-sm text-white/60">
          Invite your team and assign their roles. All self-registrations appear as guests until you promote them.
        </p>
      </header>
      <MembersClient initialUsers={serialized} />
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 text-xs text-white/60">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Role guidance</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <span className="font-semibold text-white">Organizer</span> — access scheduling, incident reports, and analytics dashboards.
          </li>
          <li>
            <span className="font-semibold text-white">Fighter</span> — view match offers, compliance tasks, and fighter analytics.
          </li>
          <li>
            <span className="font-semibold text-white">Judge</span> — manage scoring assignments and review past scorecards.
          </li>
          <li>
            <span className="font-semibold text-white">Spectator</span> — RSVP to events, follow cards, and join community threads.
          </li>
        </ul>
      </section>
    </div>
  );
}

export type MemberRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  onboarded: boolean;
  isOwner: boolean;
  createdAt: string;
};
