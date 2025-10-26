import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';

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

  async function completeOnboarding(formData: FormData) {
    'use server';
    const role = (formData.get('role') as Role) ?? Role.GUEST;
    const name = formData.get('name');
    const region = formData.get('region');
    const gym = formData.get('gym');

    const store = cookies();
    store.set('demo-role', role, { path: '/', httpOnly: false });
    if (typeof name === 'string' && name.trim()) {
      store.set('demo-name', name.trim(), { path: '/', httpOnly: false });
    }
    if (typeof region === 'string' && region.trim()) {
      store.set('demo-region', region.trim(), { path: '/', httpOnly: false });
    }
    if (typeof gym === 'string' && gym.trim()) {
      store.set('demo-gym', gym.trim(), { path: '/', httpOnly: false });
    }

    await revalidatePath('/');
    redirect(roleDestinations[role] ?? '/');
  }

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
            defaultValue={session.user.name}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Nova Cruz"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Role
          <select
            name="role"
            defaultValue={session.user.role}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
          >
            {roleOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Region
          <input
            name="region"
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Pacific Northwest"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Gym / organization
          <input
            name="gym"
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
