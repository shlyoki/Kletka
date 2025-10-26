import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EventReviewStatus } from '@prisma/client';
import { isClean, sanitize } from '@/lib/profanity';

const paginationSchema = z.object({
  status: z.nativeEnum(EventReviewStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(500),
});

async function ensureAttendance(eventId: string, userId: string) {
  const waiver = await prisma.waiver.findUnique({ where: { eventId_userId: { eventId, userId } } });
  if (waiver) return true;
  const ticket = await prisma.ticketSale.findFirst({ where: { eventId, buyerId: userId } });
  return Boolean(ticket);
}

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { searchParams } = new URL(req.url);
  const parsed = paginationSchema.safeParse({
    status: searchParams.get('status') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const { status, page, pageSize } = parsed.data;
  const where = {
    eventId: params.eventId,
    ...(status ? { status } : { status: EventReviewStatus.APPROVED }),
  };
  const [items, total] = await Promise.all([
    prisma.eventReview.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.eventReview.count({ where }),
  ]);
  return NextResponse.json({
    reviews: items.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      createdAt: review.createdAt,
      user: { id: review.userId, name: review.user?.name, image: review.user?.image },
    })),
    total,
    page,
    pageSize,
  });
}

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const parsed = reviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const allowed = await ensureAttendance(params.eventId, session.user.id);
  if (!allowed) {
    return NextResponse.json({ error: 'Must attend event before reviewing' }, { status: 403 });
  }
  if (!isClean(parsed.data.comment)) {
    return NextResponse.json({ error: 'Please remove profanity from your review.' }, { status: 400 });
  }
  const sanitizedComment = sanitize(parsed.data.comment);
  const review = await prisma.eventReview.upsert({
    where: { eventId_userId: { eventId: params.eventId, userId: session.user.id } },
    create: {
      rating: parsed.data.rating,
      comment: sanitizedComment,
      eventId: params.eventId,
      userId: session.user.id,
      status: EventReviewStatus.PENDING,
    },
    update: {
      rating: parsed.data.rating,
      comment: sanitizedComment,
      status: EventReviewStatus.PENDING,
    },
  });
  return NextResponse.json(review);
}
