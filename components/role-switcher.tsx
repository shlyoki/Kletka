'use client';

import { useTransition } from 'react';
import useSWR from 'swr';
import { Role } from '@prisma/client';
import { updateSessionRole } from '@/app/actions/session';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const roleLabels: Record<Role, string> = {
  [Role.ORGANIZER]: 'Organizer',
  [Role.FIGHTER]: 'Fighter',
  [Role.JUDGE]: 'Judge',
  [Role.SPECTATOR]: 'Guest',
  [Role.GUEST]: 'Guest',
};

export function RoleSwitcher() {
  const { data } = useSWR('/api/session', fetcher, { refreshInterval: 0 });
  const [isPending, startTransition] = useTransition();
  const activeRole: Role | undefined = data?.user?.role;

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
      <span>Role</span>
      <select
        className="bg-transparent text-white focus:outline-none"
        value={activeRole ?? Role.GUEST}
        onChange={(event) => {
          const nextRole = event.target.value as Role;
          if (nextRole === activeRole) return;
          startTransition(() => updateSessionRole(nextRole));
        }}
        disabled={isPending}
      >
        {Object.values(Role).map((role) => (
          <option key={role} value={role} className="bg-surface text-black">
            {roleLabels[role] ?? role}
          </option>
        ))}
      </select>
      {isPending && <span className="text-[10px] text-primary">Updating…</span>}
    </label>
  );
}
