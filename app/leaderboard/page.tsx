'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const weightClasses = ['Flyweight', 'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight', 'Middleweight'];
const regions = ['West', 'East', 'Midwest', 'South'];
const gyms = ['Hurricane MMA', 'Scholar Combat', 'Forge Athletics', 'Night Shift MMA'];

type LeaderboardRow = {
  id: string;
  name: string;
  nickname?: string | null;
  gym?: string | null;
  region?: string | null;
  age?: number | null;
  weightClass?: string | null;
  wins: number;
  losses: number;
  draws: number;
  elo: number;
};

export default function LeaderboardPage() {
  const [filters, setFilters] = useState({
    weightClass: '',
    region: '',
    ageMin: '',
    ageMax: '',
    gym: '',
    sort: 'elo',
    page: 1,
    pageSize: 10,
  });

  const query = new URLSearchParams();
  if (filters.weightClass) query.set('weightClass', filters.weightClass);
  if (filters.region) query.set('region', filters.region);
  if (filters.ageMin) query.set('ageMin', filters.ageMin);
  if (filters.ageMax) query.set('ageMax', filters.ageMax);
  if (filters.gym) query.set('gym', filters.gym);
  query.set('sort', filters.sort);
  query.set('page', String(filters.page));
  query.set('pageSize', String(filters.pageSize));

  const { data, isLoading } = useSWR<{ results: LeaderboardRow[]; total: number; page: number; pageSize: number }>(
    `/api/leaderboard?${query.toString()}`,
    fetcher,
  );

  const totalPages = data ? Math.ceil(data.total / filters.pageSize) : 1;

  const exportCsv = () => {
    if (!data?.results?.length) return;
    const header = ['Rank', 'Fighter', 'Gym', 'Region', 'Weight Class', 'Wins', 'Losses', 'Draws', 'ELO'];
    const body = data.results.map((row, index) => [
      String((filters.page - 1) * filters.pageSize + index + 1),
      row.nickname ? `${row.name} (“${row.nickname}”)` : row.name,
      row.gym ?? '—',
      row.region ?? '—',
      row.weightClass ?? '—',
      String(row.wins),
      String(row.losses),
      String(row.draws),
      String(row.elo),
    ]);
    const csvContent = [header, ...body].map((cells) => cells.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mfl-leaderboard-page-${filters.page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setFilters((prev) => {
      const nextPage = direction === 'prev' ? Math.max(1, prev.page - 1) : Math.min(totalPages, prev.page + 1);
      return { ...prev, page: nextPage };
    });
  };

  const tableRows = useMemo(() => data?.results ?? [], [data]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
          <FunnelIcon className="h-4 w-4" />
          Rankings intelligence
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Interactive leaderboard</h1>
            <p className="max-w-3xl text-sm text-white/60">
              Filter by weight class, region, and gym to scout matchups and track friendly ELO momentum. Export slices for
              commissioner review or gym leaderboards.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-primary/40 hover:text-white"
            onClick={exportCsv}
            disabled={!data?.results?.length}
          >
            <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </header>
      <section className="rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Weight class
            <select
              value={filters.weightClass}
              onChange={(event) => setFilters((prev) => ({ ...prev, weightClass: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {weightClasses.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Region
            <select
              value={filters.region}
              onChange={(event) => setFilters((prev) => ({ ...prev, region: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {regions.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Age range
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={16}
                placeholder="Min"
                value={filters.ageMin}
                onChange={(event) => setFilters((prev) => ({ ...prev, ageMin: event.target.value, page: 1 }))}
                className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={16}
                placeholder="Max"
                value={filters.ageMax}
                onChange={(event) => setFilters((prev) => ({ ...prev, ageMax: event.target.value, page: 1 }))}
                className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
              />
            </div>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Gym
            <select
              value={filters.gym}
              onChange={(event) => setFilters((prev) => ({ ...prev, gym: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {gyms.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-white/40">
            Sort by
            <select
              value={filters.sort}
              onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm"
            >
              <option value="elo">ELO Rating</option>
              <option value="wins">Most wins</option>
            </select>
          </label>
        </form>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full text-left text-sm text-white/70">
            <thead className="sticky top-0 bg-black/60 text-xs uppercase tracking-wide text-white/50">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Fighter</th>
                <th className="px-4 py-3">Gym</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3 text-right">Record</th>
                <th className="px-4 py-3 text-right">ELO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-surface-muted/60">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/50">
                    Loading standings…
                  </td>
                </tr>
              )}
              {!isLoading && tableRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/50">
                    No fighters match this filter set yet. Adjust filters or invite more friends to compete.
                  </td>
                </tr>
              )}
              {tableRows.map((row, index) => (
                <tr key={row.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3 text-xs uppercase tracking-wide text-white/40">
                    {(filters.page - 1) * filters.pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 text-white">
                    <div className="font-semibold">{row.name}</div>
                    {row.nickname && <div className="text-xs text-white/40">“{row.nickname}”</div>}
                  </td>
                  <td className="px-4 py-3">{row.gym ?? '—'}</td>
                  <td className="px-4 py-3">{row.region ?? '—'}</td>
                  <td className="px-4 py-3">{row.weightClass ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-white">{row.wins}-{row.losses}-{row.draws}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">{row.elo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="mt-4 flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
          <div>
            Page {filters.page} of {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-white/10 p-2 disabled:opacity-50"
              onClick={() => handlePageChange('prev')}
              disabled={filters.page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded-full border border-white/10 p-2 disabled:opacity-50"
              onClick={() => handlePageChange('next')}
              disabled={filters.page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
