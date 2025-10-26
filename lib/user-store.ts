import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID, randomBytes, pbkdf2Sync, timingSafeEqual, createHmac } from 'crypto';
import { Role } from '@prisma/client';

const DEFAULT_DB_PATH = process.env.VERCEL === '1'
  ? path.join('/tmp', 'mock-db.json')
  : path.join(process.cwd(), 'temp', 'mock-db.json');
const DB_PATH = process.env.MFL_DB_PATH ? path.resolve(process.env.MFL_DB_PATH) : DEFAULT_DB_PATH;
const FORCE_MEMORY = process.env.MFL_DB_MODE === 'memory';
const READ_ONLY_CODES = new Set(['EROFS', 'EACCES']);
const ITERATIONS = 120_000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';
const SESSION_COOKIE = 'mfl-session';
const SESSION_VERSION = 'v1';
const SESSION_SECRET = process.env.MFL_SESSION_SECRET || 'mfl-insecure-session-secret';

type SessionSnapshot = Pick<StoredUser, 'id' | 'name' | 'email' | 'role' | 'createdAt' | 'onboarded' | 'isOwner' | 'region' | 'gym'>;

interface SessionPayload {
  userId: string;
  issuedAt: number;
  nonce: string;
  snapshot: SessionSnapshot;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

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

let inMemoryDb: MockDatabase | null = null;
let preferMemory = FORCE_MEMORY;

function createSeed(): MockDatabase {
  return {
    users: [createDefaultOwner()],
    sessions: [],
  };
}

function normalizeDatabase(data: MockDatabase): MockDatabase {
  return {
    ...data,
    users: data.users.map((user) => ({
      ...user,
      onboarded: Boolean(user.onboarded),
      isOwner: Boolean(user.isOwner),
    })),
  };
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
  if (preferMemory) {
    if (!inMemoryDb) {
      inMemoryDb = createSeed();
    }
    return;
  }

  try {
    await fs.access(DB_PATH);
  } catch {
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      const seed = createSeed();
      await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException)?.code;
      if (code && READ_ONLY_CODES.has(code)) {
        preferMemory = true;
        if (!inMemoryDb) {
          inMemoryDb = createSeed();
        }
        return;
      }
      throw error;
    }
  }
}

async function readDatabase(): Promise<MockDatabase> {
  await ensureDatabase();

  if (preferMemory) {
    inMemoryDb = inMemoryDb ?? createSeed();
    const snapshot = JSON.parse(JSON.stringify(inMemoryDb)) as MockDatabase;
    return normalizeDatabase(snapshot);
  }

  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as MockDatabase;
    return normalizeDatabase(parsed);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT' || (code && READ_ONLY_CODES.has(code))) {
      preferMemory = true;
      inMemoryDb = inMemoryDb ?? createSeed();
      const snapshot = JSON.parse(JSON.stringify(inMemoryDb)) as MockDatabase;
      return normalizeDatabase(snapshot);
    }
    throw error;
  }
}

async function writeDatabase(data: MockDatabase) {
  if (preferMemory) {
    inMemoryDb = JSON.parse(JSON.stringify(data)) as MockDatabase;
    return;
  }

  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code && READ_ONLY_CODES.has(code)) {
      preferMemory = true;
      inMemoryDb = JSON.parse(JSON.stringify(data)) as MockDatabase;
      return;
    }
    throw error;
  }
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
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  const issuedAt = Date.now();
  const payload: SessionPayload = {
    userId: user.id,
    issuedAt,
    nonce: randomUUID(),
    snapshot: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      onboarded: Boolean(user.onboarded),
      isOwner: Boolean(user.isOwner),
      region: user.region,
      gym: user.gym,
    },
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  const token = `${SESSION_VERSION}.${encodedPayload}.${signature}`;

  await persistSessionRecord({ token, userId: user.id, createdAt: new Date(issuedAt).toISOString() });

  return token;
}

export async function getSession(token: string) {
  const [version, encodedPayload, signature] = token.split('.');
  if (version !== SESSION_VERSION || !encodedPayload || !signature) {
    return undefined;
  }

  let decodedPayload: SessionPayload;
  try {
    const expectedSignature = signPayload(encodedPayload);
    const provided = Buffer.from(signature, 'base64url');
    const expected = Buffer.from(expectedSignature, 'base64url');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      return undefined;
    }
    decodedPayload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;
  } catch {
    return undefined;
  }

  const persistedUser = await getUserById(decodedPayload.userId);
  const user =
    persistedUser ?? {
      id: decodedPayload.snapshot.id,
      name: decodedPayload.snapshot.name,
      email: decodedPayload.snapshot.email,
      passwordHash: '',
      role: decodedPayload.snapshot.role,
      createdAt: decodedPayload.snapshot.createdAt ?? new Date(decodedPayload.issuedAt).toISOString(),
      onboarded: decodedPayload.snapshot.onboarded,
      isOwner: decodedPayload.snapshot.isOwner,
      region: decodedPayload.snapshot.region,
      gym: decodedPayload.snapshot.gym,
    };

  if (!user) {
    return undefined;
  }

  return {
    session: { token, userId: user.id, createdAt: new Date(decodedPayload.issuedAt).toISOString() },
    user,
  };
}

export async function deleteSession(token: string) {
  await removeSessionRecord((record) => record.token === token);
}

export async function deleteSessionsForUser(userId: string) {
  await removeSessionRecord((record) => record.userId === userId);
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
  try {
    const db = await readDatabase();
    return db.sessions;
  } catch {
    return [];
  }
}

async function persistSessionRecord(record: StoredSession) {
  try {
    const db = await readDatabase();
    db.sessions = db.sessions.filter((session) => session.userId !== record.userId);
    db.sessions.push(record);
    await writeDatabase(db);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code && READ_ONLY_CODES.has(code)) {
      preferMemory = true;
      inMemoryDb = inMemoryDb ?? createSeed();
      inMemoryDb.sessions = inMemoryDb.sessions.filter((session) => session.userId !== record.userId);
      inMemoryDb.sessions.push(record);
      return;
    }
    console.warn('Failed to persist session record', error);
  }
}

async function removeSessionRecord(predicate: (record: StoredSession) => boolean) {
  try {
    const db = await readDatabase();
    const nextSessions = db.sessions.filter((record) => !predicate(record));
    if (nextSessions.length === db.sessions.length) {
      return;
    }
    db.sessions = nextSessions;
    await writeDatabase(db);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code && READ_ONLY_CODES.has(code)) {
      preferMemory = true;
      inMemoryDb = inMemoryDb ?? createSeed();
      inMemoryDb.sessions = inMemoryDb.sessions.filter((record) => !predicate(record));
      return;
    }
    console.warn('Failed to remove session record', error);
  }
}
