import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitize } from '@/lib/profanity';

const bodySchema = z.object({
  body: z.string().min(2).max(800),
});

export async function POST(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const rate = checkRateLimit(`post:${user.id}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Slow down' }, { status: 429 });
  }
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const post = await prisma.post.create({
    data: {
      threadId: params.threadId,
      authorId: user.id,
      body: sanitize(parsed.data.body),
    },
    include: { author: true },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function GET(
  _req: Request,
  { params }: { params: { threadId: string } }
) {
  const posts = await prisma.post.findMany({
    where: { threadId: params.threadId },
    include: { author: true, reactions: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ posts });
}
