'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
}

interface ToastContextValue {
  push: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within AppToastProvider');
  }
  return context;
}

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { id, ...toast }]);
      window.setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-full flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-xl border border-white/10 bg-surface/90 p-4 text-white shadow-lg backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-xs text-white/70">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="text-xs uppercase tracking-wide text-white/60 transition hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
