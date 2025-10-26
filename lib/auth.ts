import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type Session = {
  user: SessionUser;
};

const demoDefaults: SessionUser = {
  id: 'user-organizer',
  name: 'Olivia Organizer',
  email: 'olivia@example.com',
  role: Role.GUEST,
};

function parseRole(value: string | undefined): Role {
  if (!value) return Role.GUEST;
  const maybeRole = value.toUpperCase() as Role;
  return Object.values(Role).includes(maybeRole) ? maybeRole : Role.GUEST;
}

export async function auth(): Promise<Session> {
  const store = cookies();
  const role = parseRole(store.get('demo-role')?.value);
  const name = store.get('demo-name')?.value ?? demoDefaults.name;
  const email = store.get('demo-email')?.value ?? demoDefaults.email;

  return {
    user: {
      ...demoDefaults,
      role,
      name,
      email,
    },
  };
}

export async function signIn() {
  return { ok: true };
}

export async function signOut() {
  return { ok: true };
}

export async function authHandler() {
  return new Response(JSON.stringify({ message: 'Authentication is mocked in this demo environment.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
