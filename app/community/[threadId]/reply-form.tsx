'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/components/toast-provider';

export function ReplyForm({ threadId }: { threadId: string }) {
  const { push } = useToast();
  const [body, setBody] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!body.trim()) return;
        startTransition(async () => {
          const res = await fetch(`/api/community/threads/${threadId}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body }),
          });
          if (!res.ok) {
            push({ title: 'Reply failed', description: 'Please try again.' });
            return;
          }
          setBody('');
          push({ title: 'Reply posted' });
          location.reload();
        });
      }}
      className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-6"
    >
      <label className="space-y-2 text-xs uppercase tracking-wide text-white/50">
        Join the conversation
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          placeholder="Share advice, feedback, or questions for the crew."
          className="w-full rounded-2xl border border-white/10 bg-surface-muted/70 px-3 py-2 text-sm text-white"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
      >
        {isPending ? 'Posting…' : 'Reply'}
      </button>
    </form>
  );
}
