'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const ALLOWED_ROUTES = new Set(['/onboarding', '/how-it-works', '/login', '/signup']);

export function OnboardingGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSWR('/api/session', fetcher);

  useEffect(() => {
    if (!data?.user) return;
    if (ALLOWED_ROUTES.has(pathname)) return;
    if (!data.user.onboarded) {
      router.replace('/onboarding');
    }
  }, [data, pathname, router]);

  return null;
}
