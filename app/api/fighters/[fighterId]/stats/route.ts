import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function mapResult(fighterId: string, result: string, isRed: boolean) {
  if (result === 'DRAW' || result === 'NC') return result;
  if (result === 'RED') return isRed ? 'W' : 'L';
  if (result === 'BLUE') return isRed ? 'L' : 'W';
  return 'NC';
}

export async function GET(
  _req: Request,
  { params }: { params: { fighterId: string } }
) {
  const fighter = await prisma.fighterProfile.findUnique({
    where: { userId: params.fighterId },
    include: {
      boutsRed: { orderBy: { date: 'asc' } },
      boutsBlue: { orderBy: { date: 'asc' } },
    },
  });
  if (!fighter) {
    return NextResponse.json({ error: 'Fighter not found' }, { status: 404 });
  }
  const bouts = [...fighter.boutsRed, ...fighter.boutsBlue].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  let cumulativeWins = 0;
  const timeseries = bouts.map((bout) => {
    const isRed = bout.redFighterId === fighter.userId;
    const outcome = mapResult(fighter.userId, bout.result, isRed);
    if (outcome === 'W') cumulativeWins += 1;
    return {
      date: bout.date,
      cumulativeWins,
      opponentId: isRed ? bout.blueFighterId : bout.redFighterId,
      method: bout.method,
      outcome,
    };
  });
  const finishesByMethod = bouts.reduce<Record<string, number>>((acc, bout) => {
    const isRed = bout.redFighterId === fighter.userId;
    const outcome = mapResult(fighter.userId, bout.result, isRed);
    if (outcome === 'W' && bout.method !== 'DEC') {
      acc[bout.method] = (acc[bout.method] ?? 0) + 1;
    }
    return acc;
  }, {});
  const recentForm = timeseries.slice(-5).map((item) => item.outcome);
  return NextResponse.json({ timeseries, finishesByMethod, recentForm });
}
