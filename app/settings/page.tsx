"use client";

import { useState } from "react";

import { Toggle } from "@/components/toggle";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-white/60">Control privacy, notifications, and safety defaults for your league.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Notifications</h2>
          <ToggleField
            label="Push & email alerts"
            description="Match offers, judge assignments, and result updates."
            value={notifications}
            onChange={setNotifications}
          />
          <ToggleField
            label="Profanity filter"
            description="Keeps event chat respectful. Organizers can override per event."
            value={profanityFilter}
            onChange={setProfanityFilter}
          />
        </div>
        <div className="card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">Privacy</h2>
          <ToggleField
            label="Private fighter profile"
            description="Hide weight, record, and media from public search. Organizer can still view medical notes."
            value={privateProfile}
            onChange={setPrivateProfile}
          />
          <div className="rounded-2xl border border-white/10 bg-surface-muted/60 p-4 text-xs text-white/60">
            <p className="font-semibold text-white">Medical data access</p>
            <p className="mt-1">
              Medical notes and emergency contacts are encrypted and only visible to verified organizers assigned to your events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleField({
  label,
  description,
  value,
  onChange
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-sm text-white/70">
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <Toggle checked={value} onChange={onChange} />
    </div>
  );
}
