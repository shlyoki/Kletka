import { cookies } from 'next/headers';
import { Role } from '@prisma/client';
import {
  createSession,
  deleteSession,
  getSession,
  getSessionCookieName,
  StoredUser,
} from '@/lib/user-store';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isOwner: boolean;
  onboarded: boolean;
  region?: string;
  gym?: string;
};

export type Session = {
  user: SessionUser | null;
};

const COOKIE_NAME = getSessionCookieName();
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30,
};

function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isOwner: Boolean(user.isOwner),
    onboarded: Boolean(user.onboarded),
    region: user.region,
    gym: user.gym,
  };
}

export async function auth(): Promise<Session> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) {
    return { user: null };
  }
  const result = await getSession(token);
  if (!result) {
    cookies().delete(COOKIE_NAME);
    return { user: null };
  }
  return { user: toSessionUser(result.user) };
}

export async function signIn(userId: string) {
  const token = await createSession(userId);
  cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return { ok: true };
}

export async function signOut() {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
    store.delete(COOKIE_NAME);
  }
  return { ok: true };
}

export async function authHandler() {
  return new Response(
    JSON.stringify({ message: 'Use the custom signup and login endpoints for authentication.' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
