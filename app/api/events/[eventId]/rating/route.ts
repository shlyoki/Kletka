import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  const stats = await prisma.eventReview.groupBy({
    by: ['eventId'],
    where: { eventId: params.eventId, status: 'APPROVED' },
    _avg: { rating: true },
    _count: { rating: true },
  });
  if (stats.length === 0) {
    return NextResponse.json({ average: null, count: 0 });
  }
  const { _avg, _count } = stats[0];
  return NextResponse.json({ average: _avg.rating, count: _count.rating });
}
