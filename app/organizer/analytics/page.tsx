'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowDownTrayIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnalyticsEvent {
  id: string;
  title: string;
  date: string;
  revenue: number;
  expenses: number;
  roi: number | null;
  attendance: number;
  checkIns: number;
  noShowRate: number;
  uniqueFighters: number;
}

export default function OrganizerAnalyticsPage() {
  const router = useRouter();
  const [range, setRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  const params = new URLSearchParams();
  if (range.from) params.set('from', range.from);
  if (range.to) params.set('to', range.to);

  const { data: session } = useSWR<{ user?: { isOwner?: boolean } }>('/api/session', fetcher);
  const isOwner = Boolean(session?.user?.isOwner);
  const analyticsKey = isOwner ? `/api/analytics/organizer?${params.toString()}` : null;

  const { data, isLoading, error } = useSWR<{ events: AnalyticsEvent[]; totals: any; error?: string }>(analyticsKey, fetcher);
  const unauthorizedFromApi = data && 'error' in data && typeof data.error === 'string' ? data.error : null;
  const unauthorized = (!isOwner && Boolean(session)) || Boolean(unauthorizedFromApi || error);
  const unauthorizedMessage =
    !isOwner && session
      ? 'Organizer role required to view analytics. Switch roles in the header to explore friendly ROI metrics.'
      : unauthorizedFromApi || (error ? 'Forbidden' : null);

  useEffect(() => {
    if (session && !isOwner) {
      router.replace('/');
    }
  }, [isOwner, router, session]);

  const exportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'organizer-analytics.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!data) return;
    const header = ['Event', 'Date', 'Revenue', 'Expenses', 'ROI', 'Attendance', 'Check-ins', 'No-show rate'];
    const rows = data.events.map((event) => [
      event.title,
      new Date(event.date).toLocaleDateString(),
      event.revenue.toFixed(2),
      event.expenses.toFixed(2),
      event.roi !== null ? (event.roi * 100).toFixed(1) + '%' : '—',
      String(event.attendance),
      String(event.checkIns),
      `${Math.round(event.noShowRate * 100)}%`,
    ]);
    const csv = [header, ...rows].map((line) => line.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'organizer-analytics.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: 'Revenue', value: data?.totals?.revenue ?? 0, formatter: (value: number) => `$${value.toFixed(2)}` },
    { label: 'Expenses', value: data?.totals?.expenses ?? 0, formatter: (value: number) => `$${value.toFixed(2)}` },
    {
      label: 'ROI',
      value: data?.totals?.roi ?? null,
      formatter: (value: number | null) => (value === null ? '—' : `${Math.round(value * 100)}%`),
    },
    {
      label: 'Attendance',
      value: data?.totals?.attendance ?? 0,
      formatter: (value: number) => `${value} RSVPs (${data?.totals?.checkIns ?? 0} check-ins)`,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
          <CalendarDaysIcon className="h-4 w-4" />
          Organizer insights
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Analytics dashboard</h1>
            <p className="max-w-3xl text-sm text-white/60">
              Understand event performance at a glance—attendance, fighter participation, and friendly ROI trends help you plan
              the next card with confidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/60">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2"
              onClick={exportJson}
            >
              <ArrowDownTrayIcon className="h-4 w-4" /> JSON
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2"
              onClick={exportCsv}
            >
              <ArrowDownTrayIcon className="h-4 w-4" /> CSV
            </button>
          </div>
        </div>
      </header>
      <form className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white/70">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/40">
            From
            <input
              type="date"
              value={range.from}
              onChange={(event) => setRange((prev) => ({ ...prev, from: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/70 px-3 py-2"
            />
          </label>
          <label className="space-y-2 text-xs uppercase tracking-wide text-white/40">
            To
            <input
              type="date"
              value={range.to}
              onChange={(event) => setRange((prev) => ({ ...prev, to: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/70 px-3 py-2"
            />
          </label>
        </div>
      </form>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {unauthorized && (
          <div className="md:col-span-2 xl:col-span-4 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
            {unauthorizedMessage ?? 'Organizer role required to view analytics. Switch roles in the header to explore friendly ROI metrics.'}
          </div>
        )}
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white/70">
            <p className="text-xs uppercase tracking-wide text-white/40">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {kpi.formatter(kpi.value as any)}
            </p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <header className="text-xs uppercase tracking-wide text-white/50">Revenue vs expenses</header>
          <div className="mt-4 h-72">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-white/60">Loading chart…</div>
            ) : unauthorized ? (
              <div className="flex h-full items-center justify-center text-sm text-white/50">Sign in as an organizer to view ROI trends.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.events ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey={(entry: AnalyticsEvent) => new Date(entry.date).toLocaleDateString()} stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ background: '#0f111a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="rgba(34,211,238,0.25)" />
                  <Area type="monotone" dataKey="expenses" stroke="#fb7185" fill="rgba(251,113,133,0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <header className="text-xs uppercase tracking-wide text-white/50">Attendance and no-show rate</header>
          <div className="mt-4 h-72">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-white/60">Loading chart…</div>
            ) : unauthorized ? (
              <div className="flex h-full items-center justify-center text-sm text-white/50">Analytics unlock when organizer role is selected.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.events ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey={(entry: AnalyticsEvent) => entry.title} stroke="#9ca3af" hide />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ background: '#0f111a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <Bar dataKey="attendance" fill="#f97316" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="checkIns" fill="#22d3ee" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
          <span>Events overview</span>
        </header>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-wide text-white/40">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">Expenses</th>
                <th className="px-4 py-3 text-right">ROI</th>
                <th className="px-4 py-3 text-right">Attendance</th>
                <th className="px-4 py-3 text-right">No-show</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/60">
                    Crunching numbers…
                  </td>
                </tr>
              )}
              {!isLoading && !unauthorized && data?.events?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/60">
                    No events found for this range yet. Try widening the filters.
                  </td>
                </tr>
              )}
              {!unauthorized &&
                data?.events?.map((event) => (
                  <tr key={event.id} className="transition hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{event.title}</td>
                    <td className="px-4 py-3">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">${event.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-white/70">${event.expenses.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-white/70">
                      {event.roi !== null ? `${Math.round(event.roi * 100)}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-white/70">{event.attendance}</td>
                    <td className="px-4 py-3 text-right text-white/70">{Math.round(event.noShowRate * 100)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
