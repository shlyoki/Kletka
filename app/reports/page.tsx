"use client";

import Link from "next/link";

import { bouts, events } from "@/lib/data";

export default function ReportsPage() {
  const activeEvents = events.filter((event) => event.status === "Live" || event.status === "Published");
  const recentIncidents = [
    { id: "r1", title: "Bloody nose - warehouse warriors", status: "Awaiting medical note", submitted: "2024-03-18" },
    { id: "r2", title: "Sprained wrist - open mats", status: "Resolved", submitted: "2024-03-12" }
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Operations</p>
        <h1 className="text-3xl font-semibold text-white">Incident reports & audit log</h1>
        <p className="max-w-3xl text-sm text-white/60">
          Capture injuries, fouls, and bout adjustments in a single timeline. Share updates with coaches and medical staff to keep
          every friendly event transparent.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="card space-y-4 p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">File a new incident</h2>
              <p className="text-xs text-white/50">Document what happened and which actions were taken.</p>
            </div>
            <span className="rounded-full bg-amber-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
              Form
            </span>
          </header>
          <form className="space-y-4 text-sm text-white/70">
            <label className="space-y-2">
              <span className="text-xs uppercase text-white/40">Event</span>
              <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
                {activeEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({new Date(event.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-white/40">Bout</span>
              <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
                {bouts.map((bout) => (
                  <option key={bout.id} value={bout.id}>
                    Bout {bout.order} • {bout.weightClass} • {bout.ruleset}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-white/40">Summary</span>
              <textarea className="min-h-[120px] w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Describe the incident, medical response, and follow-up actions." />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-white/40">Severity</span>
              <select className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="major">Major</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase text-white/40">Attachments</span>
              <input type="file" className="w-full rounded-xl border border-dashed border-white/15 bg-surface-muted/40 px-3 py-8 text-xs text-white/50" multiple />
            </label>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
              <button type="button" className="rounded-full border border-white/15 px-5 py-2 text-white/70 transition hover:text-white" onClick={() => alert("Incident saved as draft. Share once details are confirmed.")}>
                Save draft
              </button>
              <button type="button" className="rounded-full bg-primary px-5 py-2 text-primary-foreground shadow-glow" onClick={() => alert("Incident submitted to medical and organizer staff.")}>
                Submit incident
              </button>
            </div>
          </form>
        </article>
        <aside className="space-y-4">
          <section className="card space-y-3 p-5 text-sm text-white/70">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Recent reports</h3>
            <ul className="space-y-3">
              {recentIncidents.map((incident) => (
                <li key={incident.id} className="rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
                  <p className="font-semibold text-white">{incident.title}</p>
                  <p className="text-xs text-white/40">{incident.status}</p>
                  <p className="text-xs text-white/40">Submitted {new Date(incident.submitted).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="card space-y-3 p-5 text-sm text-white/70">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Exports</h3>
            <p>Need a paper trail? Download the latest waiver log and scoring audits.</p>
            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide">
              <a href="/downloads/waiver-log.csv" className="rounded-full border border-white/15 px-5 py-2 text-center text-white/70 transition hover:text-white" download>
                Waiver log CSV
              </a>
              <a href="/downloads/results.csv" className="rounded-full border border-white/15 px-5 py-2 text-center text-white/70 transition hover:text-white" download>
                Results CSV
              </a>
            </div>
            <Link href="/dashboard" className="inline-flex text-xs font-semibold uppercase tracking-wide text-primary">
              Go to organizer dashboard
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
