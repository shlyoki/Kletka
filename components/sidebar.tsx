'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  FilmIcon,
  HomeModernIcon,
  IdentificationIcon,
  InboxStackIcon,
  MegaphoneIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { ComponentProps } from 'react';
import useSWR from 'swr';
import { useCallback } from 'react';
import { useToast } from './toast-provider';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type IconComponent = typeof HomeModernIcon;

const navItems: Array<{ href: string; label: string; icon: IconComponent; ownerOnly?: boolean }> = [
  { href: '/', label: 'Home', icon: HomeModernIcon },
  { href: '/events', label: 'Events', icon: CalendarDaysIcon },
  { href: '/fighters', label: 'Fighters', icon: UsersIcon },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
  { href: '/community', label: 'Community', icon: MegaphoneIcon },
  { href: '/organizer/analytics', label: 'Analytics', icon: ChartBarIcon, ownerOnly: true },
  { href: '/messages', label: 'Messages', icon: ChatBubbleLeftIcon },
  { href: '/media', label: 'Media', icon: FilmIcon },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useToast();
  const { data, mutate } = useSWR('/api/session', fetcher);
  const activeUser = data?.user;
  const isAuthenticated = Boolean(activeUser);

  const handleSignOut = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to sign out.');
      }
      await mutate();
      router.refresh();
      push({ title: 'Signed out' });
      onNavigate?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out.';
      push({ title: 'Sign out failed', description: message });
    }
  }, [mutate, onNavigate, push, router]);

  const profileHref = activeUser ? `/profile/${activeUser.id}` : '/login';

  return (
    <nav className="flex h-full flex-col justify-between p-6">
      <div className="space-y-10">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/60 to-primary/30 text-lg font-bold tracking-widest">
              M
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Live Events Platform</p>
              <h2 className="text-xl font-semibold tracking-wide">MFL</h2>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {navItems
            .filter((item) => !item.ownerOnly || Boolean(activeUser?.isOwner))
            .map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onNavigate={onNavigate}
                    active={isActive}
                    icon={item.icon}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary/30 text-sm font-semibold uppercase text-white">
              {(activeUser?.name ?? 'Guest')
                .split(' ')
                .map((part: string) => part[0] ?? '')
                .join('')
                .slice(0, 2) || 'GU'}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{activeUser?.name ?? 'Guest user'}</p>
              <p className="text-xs uppercase tracking-wide text-white/40">{(activeUser?.role ?? 'GUEST').toLowerCase()}</p>
            </div>
            <Link
              href={profileHref}
              className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
              onClick={onNavigate}
            >
              {isAuthenticated ? 'Profile' : 'Sign in'}
            </Link>
          </div>
        </div>
        <div className="space-y-2 text-xs text-white/40">
          <Link
            href="/safety"
            className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-primary/40"
            onClick={onNavigate}
          >
            <IdentificationIcon className="h-4 w-4" />
            Safety & Waivers
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-primary/40"
            onClick={onNavigate}
          >
            <InboxStackIcon className="h-4 w-4" />
            Incident Reports
          </Link>
        </div>
        <div>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signup"
              onClick={onNavigate}
              className="block w-full rounded-full border border-white/20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white"
            >
              Create account
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps extends ComponentProps<typeof Link> {
  active?: boolean;
  icon: IconComponent;
  onNavigate?: () => void;
}

function NavLink({ active, icon: Icon, onNavigate, ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      onClick={onNavigate}
      className={clsx(
        'group flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-semibold transition',
        active
          ? 'border-primary/60 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent text-white shadow-glow'
          : 'text-white/60 hover:border-primary/30 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon className="h-5 w-5" />
      {props.children}
    </Link>
  );
}
