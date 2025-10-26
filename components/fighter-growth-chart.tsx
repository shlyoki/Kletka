'use client';

import useSWR from 'swr';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const finishColors = ['#f87171', '#38bdf8', '#facc15', '#34d399'];

interface FighterGrowthChartProps {
  fighterId: string;
}

export function FighterGrowthChart({ fighterId }: FighterGrowthChartProps) {
  const { data, isLoading } = useSWR<{
    timeseries: { date: string; cumulativeWins: number; method: string; outcome: string }[];
    finishesByMethod: Record<string, number>;
    recentForm: string[];
  }>(`/api/fighters/${fighterId}/stats`, fetcher);

  const chartData = data?.timeseries?.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    wins: entry.cumulativeWins,
  }));

  const finishBreakdown = Object.entries(data?.finishesByMethod ?? {}).map(([method, count]) => ({
    name: method,
    value: count,
  }));

  const recentForm = data?.recentForm ?? [];

  return (
    <section className="grid gap-6 md:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
        <header className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
          <span>Wins over time</span>
          <span>{recentForm.join(' • ') || 'No bouts yet'}</span>
        </header>
        <div className="mt-4 h-64">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-white/60">Loading chart…</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="winsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f111a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                  labelStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="wins" stroke="#f97316" strokeWidth={2} fill="url(#winsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
        <header className="text-xs uppercase tracking-wide text-white/50">Finish breakdown</header>
        <div className="mt-4 h-64">
          {finishBreakdown.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-white/60">No finishes yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={finishBreakdown} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={4}>
                  {finishBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={finishColors[index % finishColors.length]} />
                  ))}
                </Pie>
                <Legend formatter={(value: string | number) => String(value).toLowerCase()} />
                <Tooltip
                  contentStyle={{ background: '#0f111a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}
                  labelStyle={{ color: '#f97316' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
