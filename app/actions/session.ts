'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

const COOKIE_OPTIONS = { path: '/', httpOnly: false } as const;

export async function updateSessionRole(role: Role) {
  cookies().set('demo-role', role, { ...COOKIE_OPTIONS });
  await revalidatePath('/');
}

export async function updateSessionIdentity({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) {
  const store = cookies();
  if (typeof name === 'string' && name.trim()) {
    store.set('demo-name', name.trim(), { ...COOKIE_OPTIONS });
  }
  if (typeof email === 'string' && email.trim()) {
    store.set('demo-email', email.trim(), { ...COOKIE_OPTIONS });
  }
  await revalidatePath('/');
}
