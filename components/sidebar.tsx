"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
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

type IconComponent = typeof HomeModernIcon;

const navItems: Array<{ href: string; label: string; icon: IconComponent }> = [
  { href: "/", label: "Home", icon: HomeModernIcon },
  { href: "/events", label: "Events", icon: CalendarDaysIcon },
  { href: "/create-event", label: "Create Event", icon: ClipboardDocumentListIcon },
  { href: "/matchmaking", label: "Matchmaking", icon: FireIcon },
  { href: "/messages", label: "Messages", icon: ChatBubbleLeftIcon },
  { href: "/dashboard", label: "Dashboard", icon: ClipboardDocumentCheckIcon },
  { href: "/leaderboards", label: "Leaderboards", icon: TrophyIcon },
  { href: "/settings", label: "Settings", icon: ShieldCheckIcon }
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col justify-between p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20" />
          <div>
            <h2 className="text-xl font-bold tracking-wider">MFL</h2>
            <p className="text-xs uppercase text-white/40">MMA Friends League</p>
          </div>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} onNavigate={onNavigate} active={pathname === item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
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
        "group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition",
        active
          ? "border-primary/60 bg-primary/10 text-white"
          : "border-white/5 text-white/60 hover:border-primary/30 hover:bg-primary/5 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      {props.children}
    </Link>
  );
}
