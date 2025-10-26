import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  weightClass: z.string().optional(),
  region: z.string().optional(),
  ageMin: z.coerce.number().optional(),
  ageMax: z.coerce.number().optional(),
  gym: z.string().optional(),
  sort: z.enum(['elo', 'wins']).default('elo'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

function computeElo(wins: number, losses: number, draws: number) {
  const base = 1200 + wins * 25 - losses * 15 + draws * 5;
  return Math.max(base, 0);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    weightClass: searchParams.get('weightClass') ?? undefined,
    region: searchParams.get('region') ?? undefined,
    ageMin: searchParams.get('ageMin') ?? undefined,
    ageMax: searchParams.get('ageMax') ?? undefined,
    gym: searchParams.get('gym') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { weightClass, region, ageMin, ageMax, gym, sort, page, pageSize } = parsed.data;
  const fighters = await prisma.fighterProfile.findMany({
    where: {
      ...(weightClass ? { weightClass } : {}),
      ...(region ? { region } : {}),
      ...(gym ? { gym: { contains: gym, mode: 'insensitive' } } : {}),
      ...(ageMin || ageMax
        ? {
            age: {
              ...(ageMin ? { gte: ageMin } : {}),
              ...(ageMax ? { lte: ageMax } : {}),
            },
          }
        : {}),
    },
    include: {
      user: true,
      boutsRed: { orderBy: { date: 'asc' } },
      boutsBlue: { orderBy: { date: 'asc' } },
    },
  });

  const standings = fighters.map((fighter) => {
    const bouts = [...fighter.boutsRed, ...fighter.boutsBlue].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const wins = bouts.filter((bout) =>
      (bout.redFighterId === fighter.userId && bout.result === 'RED') ||
      (bout.blueFighterId === fighter.userId && bout.result === 'BLUE')
    ).length;
    const losses = bouts.filter((bout) =>
      (bout.redFighterId === fighter.userId && bout.result === 'BLUE') ||
      (bout.blueFighterId === fighter.userId && bout.result === 'RED')
    ).length;
    const draws = bouts.filter((bout) => bout.result === 'DRAW').length;
    const elo = computeElo(wins, losses, draws);

    return {
      id: fighter.userId,
      name: fighter.user?.name ?? fighter.nickname ?? 'Unknown',
      nickname: fighter.nickname,
      gym: fighter.gym,
      region: fighter.region,
      age: fighter.age,
      weightClass: fighter.weightClass,
      wins,
      losses,
      draws,
      elo,
    };
  });

  standings.sort((a, b) => {
    if (sort === 'wins') {
      return b.wins - a.wins;
    }
    return b.elo - a.elo;
  });

  const start = (page - 1) * pageSize;
  const paginated = standings.slice(start, start + pageSize);

  return NextResponse.json({
    results: paginated,
    total: standings.length,
    page,
    pageSize,
  });
}
