import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitize } from '@/lib/profanity';

const updateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  body: z.string().min(3).max(1000).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { threadId: string } }
) {
  const thread = await prisma.thread.findUnique({
    where: { id: params.threadId },
    include: {
      author: true,
      posts: { include: { author: true }, orderBy: { createdAt: 'asc' } },
      reactions: true,
    },
  });
  if (!thread) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(thread);
}

export async function PATCH(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const thread = await prisma.thread.findUnique({ where: { id: params.threadId } });
  if (!thread || thread.authorId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const rate = checkRateLimit(`thread-edit:${user.id}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Slow down' }, { status: 429 });
  }
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.thread.update({
    where: { id: params.threadId },
    data: {
      ...(parsed.data.title ? { title: sanitize(parsed.data.title) } : {}),
      ...(parsed.data.body ? { body: sanitize(parsed.data.body) } : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const thread = await prisma.thread.findUnique({ where: { id: params.threadId } });
  if (!thread || thread.authorId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await prisma.thread.delete({ where: { id: params.threadId } });
  return NextResponse.json({ ok: true });
}
