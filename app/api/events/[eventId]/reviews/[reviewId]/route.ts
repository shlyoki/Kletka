import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EventReviewStatus, Role } from '@prisma/client';

const bodySchema = z.object({
  status: z.nativeEnum(EventReviewStatus),
});

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string; reviewId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== Role.ORGANIZER) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const event = await prisma.event.findUnique({ where: { id: params.eventId } });
  if (!event || event.organizerId !== session.user.id) {
    return NextResponse.json({ error: 'Not allowed to moderate reviews for this event' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.eventReview.update({
    where: { id: params.reviewId },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(updated);
}
