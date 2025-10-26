'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';

export default function SignupPage() {
  const router = useRouter();
  const { push } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to create account.');
      }
      push({ title: 'Account created', description: 'Welcome! Finish onboarding to explore the league.' });
      router.push('/onboarding');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      push({ title: 'Signup failed', description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Join MMA Friends League</h1>
        <p className="text-sm text-white/60">
          Create your account to access matchmaking, events, and community updates. All new members start as guests until the
          owner promotes you.
        </p>
      </header>
      <form className="card space-y-6 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Full name</span>
            <input
              className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2"
              placeholder="Kai Rivera"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Email</span>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-xs uppercase text-white/40">Password</span>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              minLength={8}
              required
            />
          </label>
        </div>
        <p className="text-xs text-white/50">
          By creating an account you agree to the community code and safety guidelines. Organizer access remains locked to the
          owner.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <div className="text-center text-xs text-white/60">
        Already have an account?{' '}
        <Link href="/login" className="text-primary">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
