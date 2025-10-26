'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';

export default function LoginPage() {
  const router = useRouter();
  const { push } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Invalid email or password.');
      }
      push({ title: 'Welcome back', description: 'You are now signed in.' });
      if (!payload?.user?.onboarded) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      push({ title: 'Login failed', description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-white/60">Access your dashboard, manage events, and stay connected with the league.</p>
      </header>
      <form className="card space-y-6 p-6" onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="text-center text-xs text-white/60">
        Need an account?{' '}
        <Link href="/signup" className="text-primary">
          Create one here
        </Link>
      </div>
    </div>
  );
}
