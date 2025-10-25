import type { Bout, Event, MediaAsset, Notification, Scorecard, User } from "./types";

export const users: User[] = [
  {
    id: "u1",
    role: "organizer",
    name: "Nova Cruz",
    email: "nova@mmafriendsleague.com",
    verified: true
  },
  {
    id: "u2",
    role: "fighter",
    name: "Kai " + "" + "Rivera",
    nickname: "The Tempest",
    email: "kai@example.com",
    weightClass: "Lightweight",
    stance: "Orthodox",
    experienceLevel: "Intermediate",
    gym: "Forge Athletics",
    record: { wins: 5, losses: 1, draws: 0 },
    preferredRuleset: "MMA",
    medicalNotes: "Healed wrist sprain (cleared)",
    emergencyContact: "Ava Rivera (555-2010)",
    verified: true
  },
  {
    id: "u3",
    role: "fighter",
    name: "Lena Hart",
    nickname: "Nightfall",
    email: "lena@example.com",
    weightClass: "Featherweight",
    stance: "Southpaw",
    experienceLevel: "Advanced",
    gym: "Night Shift MMA",
    record: { wins: 8, losses: 2, draws: 1 },
    preferredRuleset: "Kickboxing"
  },
  {
    id: "u4",
    role: "judge",
    name: "Marcus Le",
    email: "marcus@example.com"
  },
  {
    id: "u5",
    role: "spectator",
    name: "Aria Bloom",
    email: "aria@example.com"
  }
];

export const events: Event[] = [
  {
    id: "e1",
    title: "Warehouse Warriors 5",
    date: "2024-04-18",
    time: "19:00",
    venue: "Forge Athletics - Private Warehouse",
    visibility: "Unlisted",
    rulesetDefault: "MMA",
    status: "Published",
    rsvpLimit: 80,
    attendees: 57,
    paid: true,
    price: 25,
    equipment: ["Mouthguards", "16oz Gloves", "Shin Guards", "Headgear (Beginner)"],
    minAge: 18,
    waiverRequired: true,
    description:
      "Invite-only fight night with emphasis on safety. All fighters must pass the equipment check and sign digital waivers.",
    organizerId: "u1",
    featuredBoutId: "b1"
  },
  {
    id: "e2",
    title: "Sunday Roll-Off",
    date: "2024-05-05",
    time: "13:00",
    venue: "Flow State BJJ Loft",
    visibility: "Public",
    rulesetDefault: "Grappling",
    status: "Draft",
    rsvpLimit: 64,
    attendees: 22,
    paid: false,
    equipment: ["Grappling shorts", "Rashguards", "No heel hooks (Beginner)"],
    minAge: 16,
    waiverRequired: true,
    description:
      "Single elimination brackets with ELO leaderboard updates for every submission win.",
    organizerId: "u1"
  }
];

export const bouts: Bout[] = [
  {
    id: "b1",
    eventId: "e1",
    order: 1,
    weightClass: "Lightweight",
    rounds: 3,
    roundLength: 3,
    ruleset: "MMA",
    redFighterId: "u2",
    blueFighterId: "u3",
    judges: ["u4"],
    status: "Confirmed",
    notes: "Friendly elbows off. Optional headgear.",
    method: "Decision",
    result: "Red"
  },
  {
    id: "b2",
    eventId: "e1",
    order: 2,
    weightClass: "Welterweight",
    rounds: 3,
    roundLength: 2,
    ruleset: "Kickboxing",
    redFighterId: "u3",
    blueFighterId: "u2",
    judges: ["u4"],
    status: "Proposed"
  }
];

export const scorecards: Scorecard[] = [
  { boutId: "b1", judgeId: "u4", round: 1, red: 10, blue: 9 },
  { boutId: "b1", judgeId: "u4", round: 2, red: 9, blue: 10, fouls: "Grabbing cage warning" },
  { boutId: "b1", judgeId: "u4", round: 3, red: 10, blue: 9 }
];

export const notifications: Notification[] = [
  {
    id: "n1",
    message: "Kai Rivera accepted matchup vs Lena Hart.",
    type: "match",
    date: "2024-03-21"
  },
  {
    id: "n2",
    message: "Warehouse Warriors 5 check-in opens in 2 hours.",
    type: "checkin",
    date: "2024-03-22"
  },
  {
    id: "n3",
    message: "Judge Marcus Le submitted b1 scorecard.",
    type: "result",
    date: "2024-03-22"
  }
];

export const media: MediaAsset[] = [
  {
    id: "m1",
    eventId: "e1",
    boutId: "b1",
    uploaderId: "u5",
    type: "photo",
    url: "/media/b1-celebration.jpg",
    caption: "Kai raises hands after split decision win.",
    tags: ["celebration", "lightweight", "mma"]
  },
  {
    id: "m2",
    eventId: "e1",
    uploaderId: "u5",
    type: "video",
    url: "/media/b2-spinning-backfist.mp4",
    caption: "Slow motion of Lena's spinning backfist attempt.",
    tags: ["highlight", "kickboxing"]
  }
];
