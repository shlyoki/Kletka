export type Role = "fighter" | "organizer" | "spectator" | "judge";
export type Ruleset = "MMA" | "Kickboxing" | "Boxing" | "Grappling";

export interface User {
  id: string;
  role: Role;
  name: string;
  nickname?: string;
  avatar?: string;
  email: string;
  weightClass?: string;
  stance?: string;
  gym?: string;
  experienceLevel?: "Beginner" | "Intermediate" | "Advanced";
  record?: {
    wins: number;
    losses: number;
    draws: number;
  };
  statusTag?: string;
  winRate?: number;
  finishes?: number;
  knockouts?: number;
  preferredRuleset?: Ruleset;
  medicalNotes?: string;
  emergencyContact?: string;
  verified?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  visibility: "Public" | "Unlisted" | "Private";
  rulesetDefault: Ruleset;
  status: "Draft" | "Published" | "Live" | "Completed";
  rsvpLimit: number;
  attendees: number;
  paid: boolean;
  price?: number;
  equipment: string[];
  minAge: number;
  waiverRequired: boolean;
  description: string;
  organizerId: string;
  featuredBoutId?: string;
}

export interface Bout {
  id: string;
  eventId: string;
  order: number;
  weightClass: string;
  rounds: number;
  roundLength: number;
  ruleset: Ruleset;
  redFighterId: string;
  blueFighterId: string;
  judges: string[];
  status: "Proposed" | "Confirmed" | "In Progress" | "Completed";
  method?: string;
  result?: "Red" | "Blue" | "Draw";
  notes?: string;
}

export interface Scorecard {
  boutId: string;
  judgeId: string;
  round: number;
  red: number;
  blue: number;
  fouls?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "match" | "checkin" | "result" | "waiver";
  date: string;
}

export interface MediaAsset {
  id: string;
  eventId: string;
  boutId?: string;
  uploaderId: string;
  type: "photo" | "video";
  url: string;
  caption: string;
  tags: string[];
}
