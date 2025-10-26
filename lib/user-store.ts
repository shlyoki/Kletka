import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID, randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import { Role } from '@prisma/client';

const DEFAULT_DB_PATH = path.join(process.cwd(), 'temp', 'mock-db.json');
const DB_PATH = process.env.MFL_DB_PATH ? path.resolve(process.env.MFL_DB_PATH) : DEFAULT_DB_PATH;
const ITERATIONS = 120_000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';
const SESSION_COOKIE = 'mfl-session';

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  isOwner?: boolean;
  onboarded: boolean;
  region?: string;
  gym?: string;
}

interface MockDatabase {
  users: StoredUser[];
  sessions: StoredSession[];
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

function createDefaultOwner(): StoredUser {
  const passwordHash = hashPassword('organizer123');
  return {
    id: 'user-organizer',
    name: 'Olivia Organizer',
    email: 'olivia@example.com',
    passwordHash,
    role: Role.ORGANIZER,
    createdAt: new Date().toISOString(),
    isOwner: true,
    onboarded: true,
    region: 'Pacific Northwest',
    gym: 'Warehouse Warriors',
  };
}

async function ensureDatabase() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const seed: MockDatabase = {
      users: [createDefaultOwner()],
      sessions: [],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
  }
}

async function readDatabase(): Promise<MockDatabase> {
  await ensureDatabase();
  const raw = await fs.readFile(DB_PATH, 'utf8');
  const parsed = JSON.parse(raw) as MockDatabase;
  parsed.users = parsed.users.map((user) => ({
    ...user,
    onboarded: Boolean(user.onboarded),
    isOwner: Boolean(user.isOwner),
  }));
  return parsed;
}

async function writeDatabase(data: MockDatabase) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) {
    return false;
  }
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  const derivedBuffer = Buffer.from(derived, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  if (derivedBuffer.length !== hashBuffer.length) {
    return false;
  }
  return timingSafeEqual(derivedBuffer, hashBuffer);
}

export async function getUserByEmail(email: string) {
  const db = await readDatabase();
  const normalized = email.trim().toLowerCase();
  return db.users.find((user) => user.email.toLowerCase() === normalized);
}

export async function getUserById(id: string) {
  const db = await readDatabase();
  return db.users.find((user) => user.id === id);
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const db = await readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some((existing) => existing.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Email is already registered.');
  }
  const user: StoredUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: Role.GUEST,
    createdAt: new Date().toISOString(),
    onboarded: false,
    isOwner: false,
  };
  db.users.push(user);
  await writeDatabase(db);
  return user;
}

export async function createSession(userId: string) {
  const db = await readDatabase();
  const token = randomUUID();
  db.sessions = db.sessions.filter((session) => session.userId !== userId);
  db.sessions.push({ token, userId, createdAt: new Date().toISOString() });
  await writeDatabase(db);
  return token;
}

export async function getSession(token: string) {
  const db = await readDatabase();
  const session = db.sessions.find((item) => item.token === token);
  if (!session) {
    return undefined;
  }
  const user = db.users.find((item) => item.id === session.userId);
  if (!user) {
    return undefined;
  }
  return { session, user };
}

export async function deleteSession(token: string) {
  const db = await readDatabase();
  const nextSessions = db.sessions.filter((item) => item.token !== token);
  if (nextSessions.length === db.sessions.length) {
    return;
  }
  db.sessions = nextSessions;
  await writeDatabase(db);
}

export async function deleteSessionsForUser(userId: string) {
  const db = await readDatabase();
  db.sessions = db.sessions.filter((session) => session.userId !== userId);
  await writeDatabase(db);
}

export async function setUserRole(userId: string, role: Role) {
  const db = await readDatabase();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }
  user.role = role;
  await writeDatabase(db);
  return user;
}

export async function updateUserProfile(userId: string, updates: {
  name?: string;
  email?: string;
  region?: string;
  gym?: string;
  onboarded?: boolean;
}) {
  const db = await readDatabase();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }
  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    if (normalizedEmail !== user.email && db.users.some((existing) => existing.email === normalizedEmail)) {
      throw new Error('Email is already registered.');
    }
    user.email = normalizedEmail;
  }
  if (typeof updates.name === 'string') {
    user.name = updates.name.trim();
  }
  if (typeof updates.region === 'string') {
    user.region = updates.region.trim();
  }
  if (typeof updates.gym === 'string') {
    user.gym = updates.gym.trim();
  }
  if (typeof updates.onboarded === 'boolean') {
    user.onboarded = updates.onboarded;
  }
  await writeDatabase(db);
  return user;
}

export async function listUsers() {
  const db = await readDatabase();
  return db.users;
}

export async function listSessions() {
  const db = await readDatabase();
  return db.sessions;
}
