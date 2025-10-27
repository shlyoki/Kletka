import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';
import { setUserRole, updateUserProfile } from '@/lib/user-store';

const roleDestinations: Record<Role, string> = {
  [Role.ORGANIZER]: '/dashboard',
  [Role.FIGHTER]: '/fighters',
  [Role.JUDGE]: '/events',
  [Role.SPECTATOR]: '/how-it-works',
  [Role.GUEST]: '/how-it-works',
};

const roleLabels: Record<Role, string> = {
  [Role.ORGANIZER]: 'Organizer',
  [Role.FIGHTER]: 'Fighter',
  [Role.JUDGE]: 'Judge',
  [Role.SPECTATOR]: 'Guest',
  [Role.GUEST]: 'Guest',
};

function roleOptions() {
  return Object.values(Role).map((role) => ({ value: role, label: roleLabels[role] ?? role }));
}

export default async function OnboardingPage() {
  const session = await auth();
  if (!session.user) {
    redirect('/signup');
  }

  async function completeOnboarding(formData: FormData) {
    'use server';
    const current = await auth();
    if (!current.user) {
      redirect('/signup');
    }
    const name = formData.get('name');
    const region = formData.get('region');
    const gym = formData.get('gym');
    const requestedRole = (formData.get('role') as Role) ?? current.user.role;
    const finalRole = current.user.isOwner ? requestedRole : current.user.role;

    await updateUserProfile(current.user.id, {
      name: typeof name === 'string' ? name : undefined,
      region: typeof region === 'string' ? region : undefined,
      gym: typeof gym === 'string' ? gym : undefined,
      onboarded: true,
    });

    if (current.user.isOwner && requestedRole !== current.user.role) {
      await setUserRole(current.user.id, finalRole);
    }

    redirect(roleDestinations[finalRole] ?? '/');
  }

  const user = session.user;
  const disableRoleSelection = !user.isOwner;

  return (
    <div className="space-y-10">
      <header className="space-y-3 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Welcome to MFL</p>
        <h1 className="text-3xl font-semibold">Choose your path</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Tell us how you participate so we can guide you to the right tools—organizers get analytics, fighters see match offers,
          and judges access scoring assignments.
        </p>
      </header>
      <form action={completeOnboarding} className="space-y-5 rounded-3xl border border-white/10 bg-black/30 p-6">
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Your name
          <input
            name="name"
            defaultValue={user.name}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Denis Dimdim"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Role
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            disabled={disableRoleSelection}
          >
            {roleOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {disableRoleSelection && (
            <p className="text-[11px] uppercase tracking-wide text-white/40">
              Only the owner can assign roles. You will remain a guest until promoted.
            </p>
          )}
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Region
          <input
            name="region"
            defaultValue={user.region ?? ''}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Pacific Northwest"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Gym / organization
          <input
            name="gym"
            defaultValue={user.gym ?? ''}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Warehouse Warriors"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
        >
          Continue
        </button>
      </form>
      <section className="grid gap-4 md:grid-cols-3">
        {roleOptions().map((option) => (
          <div key={option.value} className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            <h2 className="text-lg font-semibold text-white">{option.label}</h2>
            <p className="mt-2 text-sm text-white/60">
              {option.value === Role.ORGANIZER && 'Plan events, manage waivers, and review ROI dashboards.'}
              {option.value === Role.FIGHTER && 'Share availability, track friendly records, and accept matchups.'}
              {option.value === Role.JUDGE && 'Confirm assignments, score rounds, and file bout notes.'}
              {(option.value === Role.GUEST || option.value === Role.SPECTATOR) &&
                'Follow cards, RSVP, and relive the highlights from community media.'}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
