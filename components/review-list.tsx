'use client';

import { useToast } from '@/components/toast-provider';
import { EventReviewStatus, Role } from '@prisma/client';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ReviewListProps {
  eventId: string;
  allowModeration?: boolean;
  statusFilter?: EventReviewStatus;
  currentRole?: Role;
}

export function ReviewList({ eventId, allowModeration = false, statusFilter, currentRole }: ReviewListProps) {
  const { push } = useToast();
  const query = new URLSearchParams();
  if (statusFilter) query.set('status', statusFilter);
  const { data, isLoading } = useSWR(`/api/events/${eventId}/reviews?${query.toString()}`, fetcher);

  const moderate = async (reviewId: string, status: EventReviewStatus) => {
    const res = await fetch(`/api/events/${eventId}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      push({ title: 'Moderation failed', description: 'Please try again.' });
      return;
    }
    push({ title: 'Review updated' });
    mutate(`/api/events/${eventId}/reviews?${query.toString()}`);
    mutate(`/api/events/${eventId}/rating`);
  };

  if (isLoading) {
    return <div className="text-sm text-white/40">Loading reviews…</div>;
  }

  if (!data || data.reviews.length === 0) {
    return <div className="text-sm text-white/50">No feedback yet. Encourage attendees to share their experience.</div>;
  }

  return (
    <ul className="space-y-3">
      {data.reviews.map((review: any) => (
        <li key={review.id} className="rounded-xl border border-white/10 bg-surface/70 p-4 text-sm text-white/80">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{review.user?.name ?? 'Anonymous'}</p>
              <p className="text-xs uppercase tracking-wide text-white/50">Rated {review.rating}/5</p>
            </div>
            <p className="text-xs text-white/50">{new Date(review.createdAt).toLocaleDateString()}</p>
          </header>
          <p className="mt-3 text-sm text-white/80">{review.comment}</p>
          {allowModeration && currentRole === Role.ORGANIZER && (
            <div className="mt-4 flex gap-2">
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide"
                onClick={() => moderate(review.id, EventReviewStatus.APPROVED)}
              >
                Approve
              </button>
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide"
                onClick={() => moderate(review.id, EventReviewStatus.HIDDEN)}
              >
                Hide
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
