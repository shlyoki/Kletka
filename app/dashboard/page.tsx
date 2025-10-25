import { bouts, events, notifications } from "@/lib/data";
import Link from "next/link";

export default function DashboardPage() {
  const pendingEvents = events.filter((event) => event.status !== "Completed");
  const incidentReports = [
    { id: "r1", title: "Minor ankle tweak", status: "Resolved", updatedAt: "2024-03-10" },
    { id: "r2", title: "Bloody nose", status: "Awaiting follow-up", updatedAt: "2024-03-18" }
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Organizer Dashboard</h1>
        <p className="text-sm text-white/60">Approve fighters, manage incidents, export results, and monitor payouts.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-3">
        <article className="card space-y-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Pending approvals</h2>
          <p className="text-3xl font-bold text-white">{bouts.filter((bout) => bout.status === "Proposed").length}</p>
          <p className="text-xs text-white/50">Matchups awaiting consent from both fighters.</p>
          <Link href="/matchmaking" className="text-xs uppercase tracking-wide text-primary">
            Review matchups
          </Link>
        </article>
        <article className="card space-y-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Events live</h2>
          <p className="text-3xl font-bold text-white">{pendingEvents.length}</p>
          <p className="text-xs text-white/50">Active or upcoming events under your supervision.</p>
          <Link href="/events" className="text-xs uppercase tracking-wide text-primary">
            Manage events
          </Link>
        </article>
        <article className="card space-y-2 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">Notifications</h2>
          <p className="text-3xl font-bold text-white">{notifications.length}</p>
          <p className="text-xs text-white/50">Auto email + push updates for fighters, judges, and spectators.</p>
          <Link href="/messages" className="text-xs uppercase tracking-wide text-primary">
            Open inbox
          </Link>
        </article>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card space-y-4 p-6">
          <header>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Incident reports</h2>
            <p className="text-xs text-white/50">Maintain medical transparency and follow-ups for friendly bouts.</p>
          </header>
          <ul className="space-y-3 text-sm text-white/70">
            {incidentReports.map((report) => (
              <li key={report.id} className="rounded-xl border border-white/5 bg-surface-muted/60 px-4 py-3">
                <p className="font-semibold text-white">{report.title}</p>
                <p className="text-xs text-white/40">Status: {report.status} • Updated {report.updatedAt}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="card space-y-4 p-6">
          <header>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Exports & payouts</h2>
            <p className="text-xs text-white/50">Send judge honorariums, download scorecards, and reconcile tickets.</p>
          </header>
          <div className="grid gap-3 text-sm">
            <button className="rounded-xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-left text-white/80">
              Export results CSV
            </button>
            <button className="rounded-xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-left text-white/80">
              Download waiver log
            </button>
            <button className="rounded-xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-left text-white/80">
              Stripe payout report
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
