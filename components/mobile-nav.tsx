"use client";

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose, children }: PropsWithChildren<MobileNavProps>) {
  return (
    <Dialog as="div" className="lg:hidden" open={open} onClose={onClose}>
      <div className="fixed inset-0 z-50 bg-black/60" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-surface-muted p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <Dialog.Title className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Navigation
          </Dialog.Title>
          <button onClick={onClose} className="rounded-lg border border-white/10 p-2" aria-label="Close navigation">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </Dialog.Panel>
    </Dialog>
  );
}
