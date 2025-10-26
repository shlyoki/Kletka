import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser, createSession, getSessionCookieName } from '@/lib/user-store';

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
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
  }

  try {
    const user = await createUser({ name, email, password });
    const token = await createSession(user.id);
    cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboarded: user.onboarded,
          isOwner: Boolean(user.isOwner),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
