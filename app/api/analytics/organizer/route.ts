import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== Role.ORGANIZER || !user.isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const fromDate = parsed.data.from ? new Date(parsed.data.from) : undefined;
  const toDate = parsed.data.to ? new Date(parsed.data.to) : undefined;

  const events = await prisma.event.findMany({
    where: {
      organizerId: user.id,
      ...(fromDate || toDate
        ? {
            date: {
              ...(fromDate ? { gte: fromDate } : {}),
              ...(toDate ? { lte: toDate } : {}),
            },
          }
        : {}),
    },
    include: {
      ticketSales: true,
      expenses: true,
      bouts: true,
      waivers: true,
    },
    orderBy: { date: 'asc' },
  });

  const aggregates = events.map((event) => {
    const revenue = event.ticketSales.reduce(
      (acc: number, sale: { price: number; qty: number }) => acc + sale.price * sale.qty,
      0
    );
    const expenses = event.expenses.reduce(
      (acc: number, expense: { amount: number }) => acc + expense.amount,
      0
    );
    const roi = expenses === 0 ? null : (revenue - expenses) / expenses;
    const attendance = event.ticketSales.reduce(
      (acc: number, sale: { qty: number }) => acc + sale.qty,
      0
    );
    const checkIns = event.waivers.length;
    const noShowRate = attendance === 0 ? 0 : Math.max(attendance - checkIns, 0) / attendance;
    const uniqueFighters = new Set(
      event.bouts.flatMap((bout: { redFighterId: string; blueFighterId: string }) => [
        bout.redFighterId,
        bout.blueFighterId,
      ])
    ).size;
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      revenue,
      expenses,
      roi,
      attendance,
      checkIns,
      noShowRate,
      uniqueFighters,
    };
  });

  const totals = aggregates.reduce(
    (acc: { revenue: number; expenses: number; attendance: number; checkIns: number; uniqueFighters: number }, item) => {
      acc.revenue += item.revenue;
      acc.expenses += item.expenses;
      acc.attendance += item.attendance;
      acc.checkIns += item.checkIns;
      acc.uniqueFighters += item.uniqueFighters;
      return acc;
    },
    { revenue: 0, expenses: 0, attendance: 0, checkIns: 0, uniqueFighters: 0 }
  );

  const roiTotal = totals.expenses === 0 ? null : (totals.revenue - totals.expenses) / totals.expenses;

  return NextResponse.json({
    events: aggregates,
    totals: { ...totals, roi: roiTotal },
  });
}
