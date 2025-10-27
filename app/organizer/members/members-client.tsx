'use client';

import { useMemo, useState, FormEvent } from 'react';
import useSWR from 'swr';
import { Role } from '@prisma/client';
import { useToast } from '@/components/toast-provider';
import type { MemberRecord } from './page';

const fetcher = (url: string) => fetch(url).then((response) => response.json());

const roleLabels: Record<Role, string> = {
  [Role.ORGANIZER]: 'Organizer',
  [Role.FIGHTER]: 'Fighter',
  [Role.JUDGE]: 'Judge',
  [Role.SPECTATOR]: 'Spectator',
  [Role.GUEST]: 'Guest',
};

interface MembersClientProps {
  initialUsers: MemberRecord[];
}

export function MembersClient({ initialUsers }: MembersClientProps) {
  const { data, mutate } = useSWR('/api/admin/users', fetcher, { fallbackData: { users: initialUsers } });
  const members = (data?.users as MemberRecord[]) ?? initialUsers;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useToast();

  const nonOwnerMembers = useMemo(() => members.filter((member) => !member.isOwner), [members]);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.FIGHTER,
  });

  async function handleRoleChange(userId: string, role: Role) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Unable to update role.');
      }
      await mutate();
      push({ title: 'Role updated', description: 'The user will need to sign in again to use their new role.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update role.';
      push({ title: 'Update failed', description: message });
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to create user.');
      }
      setFormState({ name: '', email: '', password: '', role: Role.FIGHTER });
      await mutate();
      push({ title: 'Account created', description: 'Send the credentials to the new member so they can log in.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create user.';
      push({ title: 'Creation failed', description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
            Name
            <input
              className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
              value={formState.name}
              onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
              placeholder="New member name"
              required
            />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
            Email
            <input
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
              value={formState.email}
              onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
              placeholder="person@example.com"
              required
            />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
            Temporary password
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
              value={formState.password}
              onChange={(event) => setFormState((state) => ({ ...state, password: event.target.value }))}
              placeholder="At least 8 characters"
              required
            />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
            Role
            <select
              className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
              value={formState.role}
              onChange={(event) => setFormState((state) => ({ ...state, role: event.target.value as Role }))}
            >
              {[Role.ORGANIZER, Role.FIGHTER, Role.JUDGE, Role.SPECTATOR].map((role) => (
                <option key={role} value={role} className="bg-surface text-black">
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
        <table className="min-w-full text-left text-sm text-white/70">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {nonOwnerMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-white/50">
                  No members yet. Invite your first fighter, judge, or organizer.
                </td>
              </tr>
            ) : (
              nonOwnerMembers.map((member) => (
                <tr key={member.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-semibold text-white">{member.name}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs uppercase tracking-wide text-white"
                      value={member.role}
                      onChange={(event) => handleRoleChange(member.id, event.target.value as Role)}
                    >
                      {[Role.ORGANIZER, Role.FIGHTER, Role.JUDGE, Role.SPECTATOR, Role.GUEST].map((roleOption) => (
                        <option key={roleOption} value={roleOption} className="bg-surface text-black">
                          {roleLabels[roleOption]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wide">
                    {member.onboarded ? 'Onboarded' : 'Pending onboarding'}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/50">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
