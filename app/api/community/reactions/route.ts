import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { ReactionEntityType, ReactionKind } from '@prisma/client';

const toggleSchema = z.object({
  entityType: z.nativeEnum(ReactionEntityType),
  entityId: z.string(),
  kind: z.nativeEnum(ReactionKind).default(ReactionKind.LIKE),
});

export async function POST(req: Request) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const existing = await prisma.reaction.findFirst({
    where: {
      userId: user.id,
      entityType: parsed.data.entityType,
      entityId: parsed.data.entityId,
    },
  });
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }
  await prisma.reaction.create({
    data: {
      userId: user.id,
      entityType: parsed.data.entityType,
      entityId: parsed.data.entityId,
      kind: parsed.data.kind,
    },
  });
  return NextResponse.json({ liked: true });
}
