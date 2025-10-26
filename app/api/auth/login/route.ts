import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSession, getSessionCookieName, getUserByEmail, verifyPassword } from '@/lib/user-store';

const COOKIE_NAME = getSessionCookieName();
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30,
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = await createSession(user.id);
  cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboarded: user.onboarded,
      isOwner: Boolean(user.isOwner),
    },
  });
}
