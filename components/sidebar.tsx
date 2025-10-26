<<<<<<< HEAD
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  FilmIcon,
  HomeModernIcon,
  IdentificationIcon,
  InboxStackIcon,
  TrophyIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";

type IconComponent = typeof HomeModernIcon;

const navItems: Array<{ href: string; label: string; icon: IconComponent }> = [
  { href: "/", label: "Home", icon: HomeModernIcon },
  { href: "/events", label: "Events", icon: CalendarDaysIcon },
  { href: "/fighters", label: "Fighters", icon: UsersIcon },
  { href: "/leaderboards", label: "Leaderboard", icon: TrophyIcon },
  { href: "/messages", label: "Messages", icon: ChatBubbleLeftIcon },
  { href: "/media", label: "Media", icon: FilmIcon }
=======
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  HomeModernIcon,
  IdentificationIcon,
  InboxStackIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";

const navItems = [
  { href: "/", label: "Home", icon: HomeModernIcon },
  { href: "/events", label: "Events", icon: CalendarDaysIcon },
  { href: "/create-event", label: "Create Event", icon: ClipboardDocumentListIcon },
  { href: "/matchmaking", label: "Matchmaking", icon: FireIcon },
  { href: "/messages", label: "Messages", icon: ChatBubbleLeftIcon },
  { href: "/dashboard", label: "Dashboard", icon: ClipboardDocumentCheckIcon },
  { href: "/leaderboards", label: "Leaderboards", icon: TrophyIcon },
  { href: "/settings", label: "Settings", icon: ShieldCheckIcon }
>>>>>>> origin/main
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
<<<<<<< HEAD
  const pathname = usePathname();

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
=======
  const pathname = typeof window !== "undefined" ? usePathname() : "";

  return (
    <nav className="flex h-full flex-col justify-between p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20" />
          <div>
            <h2 className="text-xl font-bold tracking-wider">MFL</h2>
            <p className="text-xs uppercase text-white/40">MMA Friends League</p>
>>>>>>> origin/main
          </div>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
<<<<<<< HEAD
              <NavLink
                href={item.href}
                onNavigate={onNavigate}
                active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                icon={item.icon}
              >
=======
              <NavLink href={item.href} onNavigate={onNavigate} active={pathname === item.href} icon={item.icon}>
>>>>>>> origin/main
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
<<<<<<< HEAD
      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary/30 text-sm font-semibold uppercase text-white">
              NC
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Nova Cruz</p>
              <p className="text-xs uppercase tracking-wide text-white/40">Admin</p>
            </div>
            <Link
              href="/profile/u1"
              className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
            >
              View
            </Link>
          </div>
        </div>
        <div className="space-y-2 text-xs text-white/40">
          <Link href="/safety" className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-primary/40">
            <IdentificationIcon className="h-4 w-4" />
            Safety & Waivers
          </Link>
          <Link href="/reports" className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-primary/40">
            <InboxStackIcon className="h-4 w-4" />
            Incident Reports
          </Link>
        </div>
=======
      <div className="space-y-4 text-xs text-white/40">
        <p className="uppercase tracking-wide">Support</p>
        <div className="space-y-2">
          <Link href="/safety" className="block rounded-xl border border-white/5 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <IdentificationIcon className="h-4 w-4" />
              Safety Protocols
            </div>
            <p className="mt-1 text-xs text-white/40">Review waivers, equipment, and emergency steps.</p>
          </Link>
          <Link href="/reports" className="block rounded-xl border border-white/5 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <InboxStackIcon className="h-4 w-4" />
              Incident Reports
            </div>
            <p className="mt-1 text-xs text-white/40">Log injuries and follow up actions.</p>
          </Link>
        </div>
        <p className="text-[10px] text-white/30">Built for friendly competition. Stay safe, stay respectful.</p>
>>>>>>> origin/main
      </div>
    </nav>
  );
}

interface NavLinkProps extends ComponentProps<typeof Link> {
  active?: boolean;
<<<<<<< HEAD
  icon: IconComponent;
=======
  icon: React.ComponentType<React.ComponentProps<"svg">>;
>>>>>>> origin/main
  onNavigate?: () => void;
}

function NavLink({ active, icon: Icon, onNavigate, ...props }: NavLinkProps) {
  return (
    <Link
      {...props}
      onClick={onNavigate}
      className={clsx(
<<<<<<< HEAD
        "group flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-primary/60 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent text-white shadow-glow"
          : "text-white/60 hover:border-primary/30 hover:bg-white/5 hover:text-white"
=======
        "group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-primary/60 bg-primary/10 text-white"
          : "border-white/5 text-white/60 hover:border-primary/30 hover:bg-primary/5 hover:text-white"
>>>>>>> origin/main
      )}
    >
      <Icon className="h-5 w-5" />
      {props.children}
    </Link>
  );
}
