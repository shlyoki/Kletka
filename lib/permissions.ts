import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function requireRole(roles: Role[]) {
  const session = await auth();
  if (!session?.user) {
    redirect('/signup');
  }
  if (!roles.includes(session.user.role)) {
    redirect('/');
  }
  return session.user;
}

export async function requireOnboarding() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signup');
  }
  if (session.user.role === Role.GUEST) {
    redirect('/onboarding');
  }
  return session.user;
}
