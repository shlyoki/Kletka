"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface ChecklistProps {
  title: string;
  items: string[];
}

export function Checklist({ title, items }: ChecklistProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  function toggle(item: string) {
    setCompleted((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  return (
    <section className="card space-y-4 p-5">
      <header>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">{title}</h2>
        <p className="text-xs text-white/50">Tap to confirm equipment and readiness requirements.</p>
      </header>
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => toggle(item)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-left transition hover:border-primary/40"
            >
              <span className="text-white/80">{item}</span>
              {completed[item] && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
