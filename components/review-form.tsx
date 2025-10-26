'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/components/toast-provider';
import { mutate } from 'swr';

interface ReviewFormProps {
  eventId: string;
}

export function ReviewForm({ eventId }: ReviewFormProps) {
  const { push } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch(`/api/events/${eventId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (!response.ok) {
        push({ title: 'Unable to submit review', description: 'Check your inputs or try again later.' });
        return;
      }
      push({ title: 'Review submitted', description: 'Thank you for sharing feedback!' });
      setComment('');
      mutate(`/api/events/${eventId}/reviews`);
      mutate(`/api/events/${eventId}/rating`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="flex flex-col gap-2 text-sm text-white/80">
        <span className="uppercase text-xs tracking-wide text-white/50">Rating</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={5}
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="w-full"
          />
          <span className="w-6 text-right text-sm font-semibold text-white">{rating}</span>
        </div>
      </label>
      <label className="flex flex-col gap-2 text-sm text-white/80">
        <span className="uppercase text-xs tracking-wide text-white/50">Comment</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          placeholder="What stood out about this event?"
          className="rounded-xl border border-white/10 bg-surface/80 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Submitting…' : 'Share review'}
      </button>
    </form>
  );
}
