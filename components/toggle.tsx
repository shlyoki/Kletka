"use client";

import { KeyboardEvent } from "react";
import clsx from "clsx";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  thumbClassName?: string;
}

export function Toggle({ checked, onChange, className, thumbClassName }: ToggleProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      onKeyDown={handleKeyDown}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        checked ? "bg-primary" : "bg-white/10",
        className
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white transition",
          checked ? "translate-x-6" : "translate-x-1",
          thumbClassName
        )}
      />
    </button>
  );
}
