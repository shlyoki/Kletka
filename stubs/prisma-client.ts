export enum Role {
  ORGANIZER = 'ORGANIZER',
  FIGHTER = 'FIGHTER',
  JUDGE = 'JUDGE',
  GUEST = 'GUEST',
  SPECTATOR = 'SPECTATOR',
}

export enum EventReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  HIDDEN = 'HIDDEN',
}

export enum ThreadScope {
  ALL = 'ALL',
  FIGHTERS = 'FIGHTERS',
  JUDGES = 'JUDGES',
  ORGANIZERS = 'ORGANIZERS',
}

export enum BoutResult {
  RED = 'RED',
  BLUE = 'BLUE',
  DRAW = 'DRAW',
  NC = 'NC',
}

export enum BoutMethod {
  KO = 'KO',
  SUB = 'SUB',
  DEC = 'DEC',
  OTH = 'OTH',
}

export enum ReactionEntityType {
  POST = 'POST',
  MEDIA = 'MEDIA',
  THREAD = 'THREAD',
}

export enum ReactionKind {
  LIKE = 'LIKE',
}

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface FighterAttributes {
  power: number;
  cardio: number;
  grappling: number;
  striking: number;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface GymLinks {
  website?: string;
  merch?: string;
}

export interface FighterProfile {
  userId: string;
  nickname?: string;
  bio?: string;
  age?: number;
  weightClass?: string;
  region?: string;
  gym?: string;
  recordW?: number;
  recordL?: number;
  recordD?: number;
  stance?: string;
  heightCm?: number;
  reachCm?: number;
  walkoutSong?: string;
  socials?: SocialLinks;
  gymLinks?: GymLinks;
  attributes?: FighterAttributes;
}

export type PrismaPromise<T> = Promise<T>;

export type Prisma = never;

export class PrismaClient {}

export default PrismaClient;
