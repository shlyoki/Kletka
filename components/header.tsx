'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import useSWR from 'swr';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { RoleSwitcher } from './role-switcher';

const breadcrumbs: Record<string, string> = {
  '/': 'Home',
  '/events': 'Events',
  '/events/': 'Events',
  '/fighters': 'Fighters',
  '/leaderboard': 'Leaderboard',
  '/messages': 'Messages',
  '/media': 'Media',
  '/community': 'Community',
  '/community/create': 'New Thread',
  '/organizer/analytics': 'Analytics',
  '/onboarding': 'Onboarding',
  '/how-it-works': 'How it works',
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = useSWR('/api/session', fetcher);

  const userName = data?.user?.name ?? 'Guest';
  const userRole = data?.user?.role ?? 'GUEST';

  const breadcrumbLabel =
    breadcrumbs[pathname] ??
    Object.entries(breadcrumbs).find(([key]) => pathname.startsWith(key))?.[1] ??
    'Explore';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060608]/75 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden rounded-xl border border-white/10 p-2"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">MMA Friends League</p>
            <h1 className="text-base font-semibold tracking-wide text-white">{breadcrumbLabel}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <RoleSwitcher />
          <Link
            href="/messages"
            className="relative rounded-xl border border-white/10 p-2"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              3
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs uppercase tracking-wide text-white/50">{userRole.toLowerCase()}</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold uppercase">
              {userName
                .split(' ')
                .map((part: string) => part[0] ?? '')
                .join('')
                .slice(0, 2) || 'GU'}
            </span>
          </div>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)}>
        <Sidebar onNavigate={() => setOpen(false)} />
      </MobileNav>
    </header>
  );
}
