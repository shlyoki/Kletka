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

const demoUser: SessionUser = {
  id: 'user-organizer',
  name: 'Olivia Organizer',
  email: 'olivia@example.com',
  role: Role.ORGANIZER,
};

export async function auth(): Promise<Session> {
  return { user: demoUser };
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
