'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ThreadScope } from '@prisma/client';
import { useToast } from '@/components/toast-provider';

const scopes: { label: string; value: ThreadScope }[] = [
  { label: 'Everyone', value: ThreadScope.ALL },
  { label: 'Fighters', value: ThreadScope.FIGHTERS },
  { label: 'Judges', value: ThreadScope.JUDGES },
  { label: 'Organizers', value: ThreadScope.ORGANIZERS },
];

export default function CreateThreadPage() {
  const router = useRouter();
  const { push } = useToast();
  const [scope, setScope] = useState<ThreadScope>(ThreadScope.ALL);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Community hub</p>
        <h1 className="text-3xl font-semibold text-white">Start a discussion</h1>
        <p className="text-sm text-white/60">Share matchup ideas, training resources, or league questions.</p>
      </header>
      <form
        className="space-y-5 rounded-3xl border border-white/10 bg-black/30 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !body.trim()) {
            push({ title: 'Missing info', description: 'Title and body are required.' });
            return;
          }
          startTransition(async () => {
            const res = await fetch('/api/community/threads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, body, roleScope: scope }),
            });
            if (!res.ok) {
              push({ title: 'Unable to create thread', description: 'Try again later.' });
              return;
            }
            const created = await res.json();
            push({ title: 'Thread published', description: 'Your discussion is live.' });
            router.push(`/community/${created.id}`);
          });
        }}
      >
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Share matchmaking feedback or ideas"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Audience
          <select
            value={scope}
            onChange={(event) => setScope(event.target.value as ThreadScope)}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
          >
            {scopes.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
          Body
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
            placeholder="Introduce the topic, share context, and let others chime in."
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
        >
          {isPending ? 'Publishing…' : 'Publish thread'}
        </button>
      </form>
    </div>
  );
}
