import { BellAlertIcon, CheckBadgeIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import type { Notification } from "@/lib/types";

interface NotificationListProps {
  notifications: Notification[];
}

const icons = {
  match: BellAlertIcon,
  checkin: ClipboardDocumentCheckIcon,
  result: CheckBadgeIcon,
  waiver: ClipboardDocumentCheckIcon
};

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <section className="card divide-y divide-white/5 overflow-hidden">
      <header className="px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Alerts & Reminders</h2>
      </header>
      <ol className="bg-surface-muted/40 text-sm">
        {notifications.map((notification) => {
          const Icon = icons[notification.type];
          return (
            <li key={notification.id} className="flex items-center gap-4 px-5 py-4 text-white/70">
              <span className="rounded-full bg-primary/15 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-white">{notification.message}</p>
                <p className="text-xs text-white/40">{new Date(notification.date).toLocaleString()}</p>
              </div>
              <button className="text-xs uppercase tracking-wide text-primary hover:text-primary/80">Open</button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
