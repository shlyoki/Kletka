import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role, ThreadScope } from '@prisma/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitize } from '@/lib/profanity';

const createSchema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(3).max(1000),
  roleScope: z.nativeEnum(ThreadScope).default(ThreadScope.ALL),
  eventId: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  const scope = session?.user?.role ?? Role.GUEST;
  const { searchParams } = new URL(req.url);
  const roleFilter = searchParams.get('scope') as ThreadScope | null;
  const where = roleFilter ? { roleScope: roleFilter } : {};
  const threads = await prisma.thread.findMany({
    where: {
      ...where,
      ...(scope === Role.ORGANIZER
        ? {}
        : scope === Role.FIGHTER
        ? { roleScope: { in: [ThreadScope.ALL, ThreadScope.FIGHTERS] } }
        : scope === Role.JUDGE
        ? { roleScope: { in: [ThreadScope.ALL, ThreadScope.JUDGES] } }
        : { roleScope: ThreadScope.ALL }),
    },
    include: { author: true, posts: { include: { author: true } }, reactions: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ threads });
}

export async function POST(req: Request) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const rate = checkRateLimit(`thread:${user.id}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Slow down' }, { status: 429 });
  }
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const thread = await prisma.thread.create({
    data: {
      title: sanitize(parsed.data.title),
      body: sanitize(parsed.data.body),
      roleScope: parsed.data.roleScope,
      authorId: user.id,
      eventId: parsed.data.eventId,
    },
  });
  return NextResponse.json(thread, { status: 201 });
}
