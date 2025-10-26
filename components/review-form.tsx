'use client';

import { useState, useTransition } from 'react';
import useSWR, { mutate } from 'swr';
import { EventReviewStatus } from '@prisma/client';
import { useToast } from '@/components/toast-provider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ReviewFormProps {
  eventId: string;
}

export function ReviewForm({ eventId }: ReviewFormProps) {
  const { push } = useToast();
  const { data: session } = useSWR('/api/session', fetcher);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const listKey = `/api/events/${eventId}/reviews`;
  const ratingKey = `/api/events/${eventId}/rating`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const optimistic = {
        id: `optimistic-${Date.now()}`,
        rating,
        comment,
        status: EventReviewStatus.PENDING,
        createdAt: new Date().toISOString(),
        user: {
          id: session?.user?.id ?? 'current-user',
          name: session?.user?.name ?? 'You',
        },
      };

      mutate(
        listKey,
        (current: any) => {
          const existing = current?.reviews ?? [];
          const filtered = existing.filter((review: any) => review.user?.id !== optimistic.user.id);
          const nextReviews = [optimistic, ...filtered];
          return {
            reviews: nextReviews,
            total: Math.max(current?.total ?? nextReviews.length, nextReviews.length),
            page: 1,
            pageSize: current?.pageSize ?? 10,
          };
        },
        { revalidate: false },
      );

      const response = await fetch(`/api/events/${eventId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        push({ title: 'Unable to submit review', description: 'Check your inputs or try again later.' });
        mutate(listKey);
        return;
      }

      push({ title: 'Review submitted', description: 'Thank you for sharing feedback!' });
      setComment('');
      mutate(listKey);
      mutate(ratingKey);
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
