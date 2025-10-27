import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { auth } from '@/lib/auth';
import { listUsers, ownerCreateUser } from '@/lib/user-store';

function ensureOwner(session: Awaited<ReturnType<typeof auth>>) {
  if (!session.user?.isOwner) {
    return NextResponse.json({ error: 'Only the owner can manage users.' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await auth();
  const error = ensureOwner(session);
  if (error) return error;

  const users = await listUsers();
  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboarded: Boolean(user.onboarded),
      isOwner: Boolean(user.isOwner),
      createdAt: user.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  const error = ensureOwner(session);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const roleValue = typeof body.role === 'string' ? body.role : '';

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
  }
  if (!roleValue || !(roleValue in Role)) {
    return NextResponse.json({ error: 'A valid role is required.' }, { status: 400 });
  }

  const role = Role[roleValue as keyof typeof Role];
  if (role === Role.GUEST) {
    return NextResponse.json({ error: 'Guests should sign up directly. Choose a different role.' }, { status: 400 });
  }

  try {
    const user = await ownerCreateUser({ name, email, password, role, onboarded: true });
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboarded: Boolean(user.onboarded),
        },
      },
      { status: 201 },
    );
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unable to create user.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
