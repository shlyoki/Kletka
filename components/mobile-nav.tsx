"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose, children }: PropsWithChildren<MobileNavProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 z-40 bg-black/60" aria-hidden="true" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-surface-muted p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Navigation</p>
          <button onClick={onClose} className="rounded-lg border border-white/10 p-2" aria-label="Close navigation">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
