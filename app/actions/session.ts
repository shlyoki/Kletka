'use server';

import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';
import { auth, signIn } from '@/lib/auth';
import { setUserRole, updateUserProfile } from '@/lib/user-store';

export async function updateSessionRole(role: Role) {
  const session = await auth();
  if (!session.user?.isOwner) {
    throw new Error('Only the owner can change roles.');
  }
  await setUserRole(session.user.id, role);
  await signIn(session.user.id);
  await revalidatePath('/');
}

export async function updateSessionIdentity({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) {
  const session = await auth();
  if (!session.user) {
    throw new Error('You must be signed in to update your profile.');
  }
  await updateUserProfile(session.user.id, {
    name,
    email,
  });
  await signIn(session.user.id);
  await revalidatePath('/');
}
