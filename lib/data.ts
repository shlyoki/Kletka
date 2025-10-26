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
<<<<<<< HEAD
    name: "Kai Rivera",
=======
    name: "Kai " + "" + "Rivera",
>>>>>>> origin/main
    nickname: "The Tempest",
    email: "kai@example.com",
    weightClass: "Lightweight",
    stance: "Orthodox",
<<<<<<< HEAD
    experienceLevel: "Advanced",
    gym: "Forge Athletics",
    record: { wins: 15, losses: 5, draws: 0 },
    winRate: 0.75,
    finishes: 12,
    knockouts: 7,
    statusTag: "Active",
=======
    experienceLevel: "Intermediate",
    gym: "Forge Athletics",
    record: { wins: 5, losses: 1, draws: 0 },
>>>>>>> origin/main
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
<<<<<<< HEAD
    weightClass: "Welterweight",
    stance: "Southpaw",
    experienceLevel: "Advanced",
    gym: "Night Shift MMA",
    record: { wins: 17, losses: 3, draws: 0 },
    winRate: 0.85,
    finishes: 11,
    knockouts: 5,
    statusTag: "Active",
    preferredRuleset: "Kickboxing",
    verified: true
  },
  {
    id: "u4",
    role: "fighter",
    name: "Rafi Stone",
    nickname: "Iron Lion",
    email: "rafi@example.com",
    weightClass: "Middleweight",
    stance: "Switch",
    experienceLevel: "Advanced",
    gym: "Iron Hive",
    record: { wins: 12, losses: 4, draws: 0 },
    winRate: 0.75,
    finishes: 9,
    knockouts: 4,
    statusTag: "Active",
    preferredRuleset: "MMA"
  },
  {
    id: "u5",
    role: "fighter",
    name: "Mira Ayers",
    nickname: "Flash",
    email: "mira@example.com",
    weightClass: "Flyweight",
    stance: "Orthodox",
    experienceLevel: "Intermediate",
    gym: "Velocity Combat",
    record: { wins: 8, losses: 2, draws: 0 },
    winRate: 0.8,
    finishes: 6,
    knockouts: 2,
    statusTag: "Active",
    preferredRuleset: "Kickboxing"
  },
  {
    id: "u6",
    role: "fighter",
    name: "Eden Cho",
    nickname: "Flow",
    email: "eden@example.com",
    weightClass: "Featherweight",
    stance: "Orthodox",
    experienceLevel: "Advanced",
    gym: "Momentum Grappling",
    record: { wins: 12, losses: 4, draws: 1 },
    winRate: 0.74,
    finishes: 10,
    knockouts: 0,
    statusTag: "Active",
    preferredRuleset: "Grappling"
  },
  {
    id: "u7",
=======
    weightClass: "Featherweight",
    stance: "Southpaw",
    experienceLevel: "Advanced",
    gym: "Night Shift MMA",
    record: { wins: 8, losses: 2, draws: 1 },
    preferredRuleset: "Kickboxing"
  },
  {
    id: "u4",
>>>>>>> origin/main
    role: "judge",
    name: "Marcus Le",
    email: "marcus@example.com"
  },
  {
<<<<<<< HEAD
    id: "u8",
=======
    id: "u5",
>>>>>>> origin/main
    role: "spectator",
    name: "Aria Bloom",
    email: "aria@example.com"
  }
];

export const events: Event[] = [
  {
    id: "e1",
<<<<<<< HEAD
    title: "Knockout Kings – Boxing Night",
    date: "2024-04-22",
    time: "19:00",
    venue: "Southside Boxing Club, 470 8th Ave",
    visibility: "Public",
    rulesetDefault: "Boxing",
    status: "Live",
    rsvpLimit: 120,
    attendees: 98,
    paid: true,
    price: 15,
    equipment: ["16oz Gloves", "Headgear (Beginner)", "Mouthguards"],
    minAge: 18,
    waiverRequired: true,
    description:
      "Friendly boxing competition with round-by-round judging. Show up early for safety checks and wrap inspections.",
=======
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
>>>>>>> origin/main
    organizerId: "u1",
    featuredBoutId: "b1"
  },
  {
    id: "e2",
<<<<<<< HEAD
    title: "Grappling Showcase",
    date: "2024-04-29",
    time: "17:00",
    venue: "Elite Martial Arts Academy, 456 Maple Rd",
    visibility: "Public",
    rulesetDefault: "Grappling",
    status: "Published",
    rsvpLimit: 80,
    attendees: 61,
    paid: true,
    price: 10,
    equipment: ["Rashguards", "No heel hooks (Beginner)", "Mat-safe nails"],
    minAge: 16,
    waiverRequired: true,
    description:
      "Round-robin brackets for all belts with medical staff on site. Auto updates to rankings after each submission win.",
    organizerId: "u1"
  },
  {
    id: "e3",
    title: "Friday Night Fights Vol. 1",
    date: "2024-05-10",
    time: "20:00",
    venue: "Downtown Combat Sports Center, 123 Main St",
    visibility: "Unlisted",
    rulesetDefault: "MMA",
    status: "Published",
    rsvpLimit: 150,
    attendees: 45,
    paid: false,
    equipment: ["4oz MMA Gloves", "Shin Guards", "Pre-bout breathalyzer"],
    minAge: 18,
    waiverRequired: true,
    description: "Invite-only friendly MMA competition. All levels welcome with organizer-approved matchups only.",
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
    ruleset: "Boxing",
    redFighterId: "u2",
    blueFighterId: "u5",
    judges: ["u7"],
    status: "Confirmed",
    notes: "16oz gloves, no knockouts pursued, ref discretion for standing eight count.",
=======
    ruleset: "MMA",
    redFighterId: "u2",
    blueFighterId: "u3",
    judges: ["u4"],
    status: "Confirmed",
    notes: "Friendly elbows off. Optional headgear.",
>>>>>>> origin/main
    method: "Decision",
    result: "Red"
  },
  {
    id: "b2",
<<<<<<< HEAD
    eventId: "e3",
    order: 2,
    weightClass: "Welterweight",
    rounds: 3,
    roundLength: 3,
    ruleset: "MMA",
    redFighterId: "u3",
    blueFighterId: "u4",
    judges: ["u7"],
=======
    eventId: "e1",
    order: 2,
    weightClass: "Welterweight",
    rounds: 3,
    roundLength: 2,
    ruleset: "Kickboxing",
    redFighterId: "u3",
    blueFighterId: "u2",
    judges: ["u4"],
>>>>>>> origin/main
    status: "Proposed"
  }
];

export const scorecards: Scorecard[] = [
<<<<<<< HEAD
  { boutId: "b1", judgeId: "u7", round: 1, red: 10, blue: 9 },
  { boutId: "b1", judgeId: "u7", round: 2, red: 10, blue: 9 },
  { boutId: "b1", judgeId: "u7", round: 3, red: 9, blue: 10, fouls: "Excessive clinch warning" }
=======
  { boutId: "b1", judgeId: "u4", round: 1, red: 10, blue: 9 },
  { boutId: "b1", judgeId: "u4", round: 2, red: 9, blue: 10, fouls: "Grabbing cage warning" },
  { boutId: "b1", judgeId: "u4", round: 3, red: 10, blue: 9 }
>>>>>>> origin/main
];

export const notifications: Notification[] = [
  {
    id: "n1",
    message: "Kai Rivera accepted matchup vs Lena Hart.",
    type: "match",
<<<<<<< HEAD
    date: "2024-03-21",
    link: "/matchmaking"
=======
    date: "2024-03-21"
>>>>>>> origin/main
  },
  {
    id: "n2",
    message: "Warehouse Warriors 5 check-in opens in 2 hours.",
    type: "checkin",
<<<<<<< HEAD
    date: "2024-03-22",
    link: "/events/e1"
=======
    date: "2024-03-22"
>>>>>>> origin/main
  },
  {
    id: "n3",
    message: "Judge Marcus Le submitted b1 scorecard.",
    type: "result",
<<<<<<< HEAD
    date: "2024-03-22",
    link: "/bouts/b1"
=======
    date: "2024-03-22"
>>>>>>> origin/main
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
