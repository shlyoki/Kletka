'use client';

import useSWR from 'swr';

interface EventRatingProps {
  eventId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function EventRating({ eventId }: EventRatingProps) {
  const { data, isLoading } = useSWR(`/api/events/${eventId}/rating`, fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return <div className="text-sm text-white/40">Loading rating…</div>;
  }

  if (!data || !data.count) {
    return <div className="text-sm text-white/50">No reviews yet</div>;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <span className="text-lg font-semibold">{data.average?.toFixed(1)}</span>
      <span className="text-xs uppercase tracking-wide text-white/60">({data.count} reviews)</span>
    </div>
  );
}
