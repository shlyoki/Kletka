"use client";

import { useState } from "react";
<<<<<<< HEAD
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Toggle } from "@/components/toggle";
=======
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import { clsx } from "clsx";
>>>>>>> origin/main

const rulesets = [
  { name: "MMA", defaults: "3 × 3 min • No elbows • No knees to head • Standing 8 count" },
  { name: "Kickboxing", defaults: "3 × 2 min • No knees to head • Limited catch-and-strike" },
  { name: "Boxing", defaults: "3 × 2 min • 16oz gloves under 175lb • Headgear optional" },
  { name: "Grappling", defaults: "1 × 6 min • Points system • No heel hooks (Beginner)" }
];

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [paid, setPaid] = useState(true);
  const [waiverRequired, setWaiverRequired] = useState(true);
<<<<<<< HEAD
  const [feedback, setFeedback] = useState<null | { status: "draft" | "published"; message: string }>(null);

  const handleSaveDraft = () => {
    setFeedback({
      status: "draft",
      message: "Draft saved. We'll remind your staff to review before publishing."
    });
  };

  const handlePublish = () => {
    setFeedback({
      status: "published",
      message: "Event published! Share the invite link or QR code with your fighters and spectators."
    });
  };
=======
>>>>>>> origin/main

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Create Event</h1>
        <p className="text-sm text-white/60">
          A guided flow to set up your venue, rules, matchmaking capacity, digital waiver, and payment preferences.
        </p>
      </header>
      <nav className="grid gap-3 sm:grid-cols-3">
        {["Details", "Rules", "Publish"].map((label, index) => (
          <button
            key={label}
            className={clsx(
              "rounded-2xl border px-4 py-3 text-left text-sm transition",
              step === index + 1
                ? "border-primary/60 bg-primary/10 text-white"
                : "border-white/10 bg-surface-muted/40 text-white/60"
            )}
            onClick={() => setStep(index + 1)}
          >
            <span className="text-xs uppercase tracking-wide text-white/40">Step {index + 1}</span>
            <p className="font-semibold">{label}</p>
          </button>
        ))}
      </nav>
<<<<<<< HEAD
      {feedback && (
        <div
          className={clsx(
            "rounded-2xl border px-4 py-3 text-sm",
            feedback.status === "published"
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-white/15 bg-white/5 text-white/70"
          )}
        >
          {feedback.message}
        </div>
      )}
      {step === 1 && <StepDetails paid={paid} setPaid={setPaid} waiverRequired={waiverRequired} setWaiverRequired={setWaiverRequired} />}
      {step === 2 && <StepRules />}
      {step === 3 && <StepPublish onPublish={handlePublish} onSaveDraft={handleSaveDraft} />}
=======
      {step === 1 && <StepDetails paid={paid} setPaid={setPaid} waiverRequired={waiverRequired} setWaiverRequired={setWaiverRequired} />}
      {step === 2 && <StepRules />}
      {step === 3 && <StepPublish />}
>>>>>>> origin/main
    </div>
  );
}

function StepDetails({
  paid,
  setPaid,
  waiverRequired,
  setWaiverRequired
}: {
  paid: boolean;
  setPaid: (value: boolean) => void;
  waiverRequired: boolean;
  setWaiverRequired: (value: boolean) => void;
}) {
  return (
    <section className="card space-y-6 p-6 text-sm text-white/70">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">Event title</span>
          <input className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Warehouse Warriors 6" />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">Venue or private location</span>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
            <MapPinIcon className="h-5 w-5 text-white/40" />
            <input className="flex-1 bg-transparent focus:outline-none" placeholder="Forge Athletics" />
          </div>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">Date</span>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2">
            <CalendarIcon className="h-5 w-5 text-white/40" />
            <input type="date" className="flex-1 bg-transparent focus:outline-none" />
          </div>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">Time</span>
          <input type="time" className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-xs uppercase text-white/40">Description</span>
        <textarea className="min-h-[120px] w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" placeholder="Outline equipment requirements, safety expectations, and format." />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">Max bouts</span>
          <input type="number" className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" defaultValue={6} />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-white/40">RSVP limit</span>
          <input type="number" className="w-full rounded-xl border border-white/10 bg-surface-muted/60 px-3 py-2" defaultValue={80} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SwitchField label="Ticketed via Stripe" enabled={paid} onChange={setPaid} />
        <SwitchField label="Digital waiver required" enabled={waiverRequired} onChange={setWaiverRequired} />
      </div>
    </section>
  );
}

function StepRules() {
  return (
    <section className="card space-y-6 p-6 text-sm text-white/70">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Rulesets & Equipment</h2>
        <p className="text-xs text-white/50">Start with defaults and customize per bout if needed.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {rulesets.map((ruleset) => (
          <article key={ruleset.name} className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
            <h3 className="text-base font-semibold text-white">{ruleset.name}</h3>
            <p className="text-xs text-white/50">{ruleset.defaults}</p>
<<<<<<< HEAD
            <Link
              href={`/settings?section=rulesets&focus=${ruleset.name.toLowerCase()}`}
              className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wide text-primary"
            >
              Customize
            </Link>
=======
            <button className="mt-4 text-xs uppercase tracking-wide text-primary">Customize</button>
>>>>>>> origin/main
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
        <h3 className="text-base font-semibold text-white">Safety add-ons</h3>
        <ul className="mt-3 space-y-2 text-xs text-white/60">
          <li>• Mandatory coach briefing 24h before first bell</li>
          <li>• Automatic hydration reminders 72h, 48h, and 24h before weigh-in</li>
          <li>• Organizer incident report template included</li>
        </ul>
      </div>
    </section>
  );
}

<<<<<<< HEAD
function StepPublish({
  onSaveDraft,
  onPublish
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
=======
function StepPublish() {
>>>>>>> origin/main
  return (
    <section className="card space-y-6 p-6 text-sm text-white/70">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Publish & Share</h2>
        <p className="text-xs text-white/50">Generate invite links, QR check-in codes, and assign staff roles.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
          <h3 className="text-base font-semibold text-white">Invite visibility</h3>
          <p className="text-xs text-white/50">Public • Unlisted • Private invite. Manage access lists per role.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
          <h3 className="text-base font-semibold text-white">QR check-in</h3>
          <p className="text-xs text-white/50">Offline-ready. Staff can scan and confirm waiver completion instantly.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
          <h3 className="text-base font-semibold text-white">Staff assignments</h3>
          <p className="text-xs text-white/50">Add judges, timekeepers, and medics. Auto-notifies via email + push.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4">
          <h3 className="text-base font-semibold text-white">Audit log</h3>
          <p className="text-xs text-white/50">Track matchmaking overrides, rule edits, and result submissions.</p>
        </article>
      </div>
      <div className="flex flex-wrap gap-3">
<<<<<<< HEAD
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow"
        >
=======
        <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
          Save draft
        </button>
        <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-glow">
>>>>>>> origin/main
          Publish event
        </button>
      </div>
    </section>
  );
}

function SwitchField({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3">
      <div>
        <p className="text-xs uppercase text-white/40">{label}</p>
        <p className="text-[11px] text-white/40">{enabled ? "Active" : "Disabled"}</p>
      </div>
<<<<<<< HEAD
      <Toggle checked={enabled} onChange={onChange} />
=======
      <Switch
        checked={enabled}
        onChange={onChange}
        className={clsx(enabled ? "bg-primary" : "bg-white/10", "relative inline-flex h-6 w-11 items-center rounded-full transition")}
      >
        <span className={clsx(enabled ? "translate-x-6" : "translate-x-1", "inline-block h-4 w-4 transform rounded-full bg-white transition")} />
      </Switch>
>>>>>>> origin/main
    </div>
  );
}
