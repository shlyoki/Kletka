import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession, getSessionCookieName } from '@/lib/user-store';

const COOKIE_NAME = getSessionCookieName();

export async function POST() {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
    store.delete(COOKIE_NAME);
  }
  return NextResponse.json({ ok: true });
}
