'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
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

  const push = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    setToasts((prev) => [...prev, { id: Date.now(), ...toast }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className="pointer-events-auto m-2 w-80 rounded-xl border border-white/10 bg-surface px-4 py-3 text-white shadow-lg"
            open
            onOpenChange={(open) => {
              if (!open) remove(toast.id);
            }}
          >
            <ToastPrimitive.Title className="text-sm font-semibold">{toast.title}</ToastPrimitive.Title>
            {toast.description && (
              <ToastPrimitive.Description className="mt-1 text-xs text-white/70">
                {toast.description}
              </ToastPrimitive.Description>
            )}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
