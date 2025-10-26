import {
  BoutMethod,
  BoutResult,
  EventReviewStatus,
  ReactionEntityType,
  ReactionKind,
  Role,
  ThreadScope,
} from '@prisma/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

interface FighterProfile {
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
  socials?: { instagram?: string };
  gymLinks?: { website?: string };
  attributes?: { power: number; cardio: number; grappling: number; striking: number };
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  organizerId: string;
  ruleset: string;
  visibility: 'Public' | 'Unlisted' | 'Private';
  status: 'Draft' | 'Published' | 'Live' | 'Completed';
}

interface EventReview {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  status: EventReviewStatus;
  createdAt: Date;
}

interface Waiver {
  id: string;
  eventId: string;
  userId: string;
  signedAt: Date;
}

interface TicketSale {
  id: string;
  eventId: string;
  price: number;
  qty: number;
  channel: string;
  buyerId?: string;
}

interface EventExpense {
  id: string;
  eventId: string;
  category: string;
  amount: number;
  note?: string;
}

interface Bout {
  id: string;
  eventId: string;
  date: Date;
  weightClass: string;
  redFighterId: string;
  blueFighterId: string;
  result: BoutResult;
  method: BoutMethod;
  round: number;
  time: string;
}

interface EventChatMessage {
  id: string;
  eventId: string;
  senderId: string;
  role: Role;
  body: string;
  createdAt: Date;
}

interface Thread {
  id: string;
  title: string;
  body: string;
  authorId: string;
  roleScope: ThreadScope;
  createdAt: Date;
  updatedAt: Date;
}

interface Post {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: Date;
}

interface Reaction {
  id: string;
  entityType: ReactionEntityType;
  entityId: string;
  userId: string;
  kind: ReactionKind;
}

interface MediaComment {
  id: string;
  mediaId: string;
  userId: string;
  body: string;
  createdAt: Date;
}

interface MediaItem {
  id: string;
  ownerId: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  title?: string;
}

const users: User[] = [
  {
    id: 'user-organizer',
    name: 'Olivia Organizer',
    email: 'olivia@example.com',
    role: Role.ORGANIZER,
  },
  {
    id: 'user-diego',
    name: 'Diego Alvarez',
    email: 'diego@example.com',
    role: Role.FIGHTER,
  },
  {
    id: 'user-maya',
    name: 'Maya Chen',
    email: 'maya@example.com',
    role: Role.FIGHTER,
  },
  {
    id: 'user-judge',
    name: 'Marcus Le',
    email: 'marcus@example.com',
    role: Role.JUDGE,
  },
  {
    id: 'user-guest',
    name: 'Aria Bloom',
    email: 'aria@example.com',
    role: Role.SPECTATOR,
  },
];

const fighterProfiles: FighterProfile[] = [
  {
    userId: 'user-diego',
    nickname: 'El Huracán',
    bio: 'Aggressive striker with slick grappling transitions.',
    age: 29,
    weightClass: 'Lightweight',
    region: 'West',
    gym: 'Hurricane MMA',
    recordW: 8,
    recordL: 2,
    recordD: 1,
    stance: 'Orthodox',
    heightCm: 175,
    reachCm: 180,
    walkoutSong: 'Hurricane',
    socials: { instagram: '@hurricane' },
    gymLinks: { website: 'https://hurricanemma.com' },
    attributes: { power: 78, cardio: 82, grappling: 74, striking: 85 },
  },
  {
    userId: 'user-maya',
    nickname: 'The Scholar',
    bio: 'Tactical kickboxer with crisp counter striking.',
    age: 26,
    weightClass: 'Featherweight',
    region: 'East',
    gym: 'Scholar Combat',
    recordW: 6,
    recordL: 1,
    recordD: 0,
    stance: 'Southpaw',
    heightCm: 168,
    reachCm: 172,
    walkoutSong: 'Rise',
    socials: { instagram: '@scholarkick' },
    attributes: { power: 70, cardio: 88, grappling: 69, striking: 90 },
  },
];

const events: Event[] = [
  {
    id: 'event-1',
    title: 'MFL Throwdown',
    description: 'High-energy friendly bouts to close the season.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    venue: 'MFL Arena',
    organizerId: 'user-organizer',
    ruleset: 'MMA',
    visibility: 'Public',
    status: 'Published',
  },
];

const waivers: Waiver[] = [
  {
    id: 'waiver-1',
    eventId: 'event-1',
    userId: 'user-diego',
    signedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const eventReviews: EventReview[] = [
  {
    id: 'review-1',
    eventId: 'event-1',
    userId: 'user-diego',
    rating: 5,
    comment: 'Electric crowd and smooth logistics!',
    status: EventReviewStatus.PENDING,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'review-2',
    eventId: 'event-1',
    userId: 'user-maya',
    rating: 4,
    comment: 'Great matchmaking, could use more warmup mats.',
    status: EventReviewStatus.APPROVED,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
];

const ticketSales: TicketSale[] = [
  { id: 'sale-1', eventId: 'event-1', price: 35, qty: 120, channel: 'Online', buyerId: 'user-organizer' },
  { id: 'sale-2', eventId: 'event-1', price: 40, qty: 45, channel: 'Door' },
];

const eventExpenses: EventExpense[] = [
  { id: 'expense-1', eventId: 'event-1', category: 'Venue', amount: 1200 },
  { id: 'expense-2', eventId: 'event-1', category: 'Insurance', amount: 400 },
  { id: 'expense-3', eventId: 'event-1', category: 'Production', amount: 800 },
];

const bouts: Bout[] = [
  {
    id: 'bout-1',
    eventId: 'event-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    weightClass: 'Lightweight',
    redFighterId: 'user-diego',
    blueFighterId: 'user-maya',
    result: BoutResult.RED,
    method: BoutMethod.DEC,
    round: 3,
    time: '3:00',
  },
];

const eventChatMessages: EventChatMessage[] = [
  {
    id: 'chat-1',
    eventId: 'event-1',
    senderId: 'user-organizer',
    role: Role.ORGANIZER,
    body: 'Doors open at 5pm sharp. Check-in desk on the left.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const threads: Thread[] = [
  {
    id: 'thread-1',
    title: 'Weigh-in Strategies',
    body: 'Share your best friendly tips to manage weight cuts safely.',
    authorId: 'user-diego',
    roleScope: ThreadScope.ALL,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const posts: Post[] = [
  {
    id: 'post-1',
    threadId: 'thread-1',
    authorId: 'user-maya',
    body: 'Hydration is everything—start early!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'post-2',
    threadId: 'thread-1',
    authorId: 'user-organizer',
    body: 'Remember to submit your medicals!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
];

const reactions: Reaction[] = [
  {
    id: 'reaction-1',
    entityType: ReactionEntityType.THREAD,
    entityId: 'thread-1',
    userId: 'user-maya',
    kind: ReactionKind.LIKE,
  },
];

const mediaItems: MediaItem[] = [
  {
    id: 'media-1',
    ownerId: 'user-maya',
    url: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
    type: 'IMAGE',
    title: 'Post-fight celebration',
  },
];

const mediaComments: MediaComment[] = [
  {
    id: 'mediacomment-1',
    mediaId: 'media-1',
    userId: 'user-diego',
    body: 'Legendary night!',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
];

let idCounter = 1000;
function createId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function findUserById(id: string) {
  return users.find((user) => user.id === id) ?? null;
}

function includeUser(userId: string | null | undefined, include?: boolean) {
  if (!include) return undefined;
  if (!userId) return null;
  const user = findUserById(userId);
  return user ? clone(user) : null;
}

function buildBout(bout: Bout, include: any = {}) {
  const result: any = clone(bout);
  if (include?.redFighter) {
    const fighter = fighterProfiles.find((profile) => profile.userId === bout.redFighterId);
    result.redFighter = fighter
      ? {
          ...clone(fighter),
          user: include?.redFighter?.include?.user ? includeUser(fighter.userId, true) : undefined,
        }
      : null;
  }
  if (include?.blueFighter) {
    const fighter = fighterProfiles.find((profile) => profile.userId === bout.blueFighterId);
    result.blueFighter = fighter
      ? {
          ...clone(fighter),
          user: include?.blueFighter?.include?.user ? includeUser(fighter.userId, true) : undefined,
        }
      : null;
  }
  return result;
}

function sortByDate<T extends { date: Date }>(items: T[], direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) =>
    direction === 'asc' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
  );
}

function buildEvent(event: Event, include: any = {}) {
  const result: any = clone(event);
  if (include.organizer) {
    result.organizer = includeUser(event.organizerId, true);
  }
  if (include.waivers) {
    result.waivers = waivers
      .filter((waiver) => waiver.eventId === event.id)
      .map((waiver) => clone(waiver));
  }
  if (include.ticketSales) {
    result.ticketSales = ticketSales
      .filter((sale) => sale.eventId === event.id)
      .map((sale) => clone(sale));
  }
  if (include.expenses) {
    result.expenses = eventExpenses
      .filter((expense) => expense.eventId === event.id)
      .map((expense) => clone(expense));
  }
  if (include.bouts) {
    const boutInclude = include.bouts.include ?? {};
    const ordered = sortByDate(
      bouts.filter((bout) => bout.eventId === event.id),
      include.bouts.orderBy?.date ?? 'asc'
    );
    result.bouts = ordered.map((bout) => buildBout(bout, boutInclude));
  }
  if (include.reviews) {
    result.reviews = eventReviews
      .filter((review) => review.eventId === event.id)
      .map((review) => clone(review));
  }
  return result;
}

function buildFighterProfile(profile: FighterProfile, include: any = {}) {
  const result: any = clone(profile);
  if (include.user) {
    result.user = includeUser(profile.userId, true);
  }
  if (include.boutsRed) {
    const ordered = sortByDate(
      bouts.filter((bout) => bout.redFighterId === profile.userId),
      include.boutsRed.orderBy?.date ?? 'asc'
    );
    result.boutsRed = ordered.map((bout) => clone(bout));
  }
  if (include.boutsBlue) {
    const ordered = sortByDate(
      bouts.filter((bout) => bout.blueFighterId === profile.userId),
      include.boutsBlue.orderBy?.date ?? 'asc'
    );
    result.boutsBlue = ordered.map((bout) => clone(bout));
  }
  return result;
}

export const prisma = {
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      const user = users.find((candidate) =>
        where.id ? candidate.id === where.id : where.email ? candidate.email === where.email : false
      );
      return user ? clone(user) : null;
    },
    async create({ data }: { data: Partial<User> & { fighter?: { create: FighterProfile } } }) {
      const id = data.id ?? createId('user');
      const user: User = {
        id,
        name: data.name ?? 'New User',
        email: data.email ?? `${id}@example.com`,
        role: data.role ?? Role.GUEST,
        image: data.image ?? null,
      };
      users.push(user);
      if (data.fighter?.create) {
        fighterProfiles.push({ ...data.fighter.create, userId: id });
      }
      return clone(user);
    },
  },
  fighterProfile: {
    async findUnique({ where, include }: { where: { userId?: string }; include?: any }) {
      const profile = fighterProfiles.find((candidate) =>
        where.userId ? candidate.userId === where.userId : false
      );
      return profile ? buildFighterProfile(profile, include) : null;
    },
    async findMany({ where = {}, include }: { where?: any; include?: any }) {
      let items = fighterProfiles;
      if (where.weightClass) {
        items = items.filter((profile) => profile.weightClass === where.weightClass);
      }
      if (where.region) {
        items = items.filter((profile) => profile.region === where.region);
      }
      if (where.gym?.contains) {
        const value = String(where.gym.contains).toLowerCase();
        items = items.filter((profile) => profile.gym?.toLowerCase().includes(value));
      }
      if (where.age?.gte) {
        items = items.filter((profile) => (profile.age ?? 0) >= where.age.gte);
      }
      if (where.age?.lte) {
        items = items.filter((profile) => (profile.age ?? 0) <= where.age.lte);
      }
      return items.map((profile) => buildFighterProfile(profile, include));
    },
  },
  event: {
    async findUnique({ where, include }: { where: { id: string }; include?: any }) {
      const event = events.find((candidate) => candidate.id === where.id);
      return event ? buildEvent(event, include) : null;
    },
    async findMany({ where = {}, include, orderBy }: { where?: any; include?: any; orderBy?: any }) {
      let items = events;
      if (where.organizerId) {
        items = items.filter((event) => event.organizerId === where.organizerId);
      }
      if (where.date?.gte) {
        items = items.filter((event) => event.date.getTime() >= where.date.gte.getTime());
      }
      if (where.date?.lte) {
        items = items.filter((event) => event.date.getTime() <= where.date.lte.getTime());
      }
      let ordered = [...items];
      if (orderBy?.date === 'asc') {
        ordered.sort((a, b) => a.date.getTime() - b.date.getTime());
      } else if (orderBy?.date === 'desc') {
        ordered.sort((a, b) => b.date.getTime() - a.date.getTime());
      }
      return ordered.map((event) => buildEvent(event, include));
    },
  },
  waiver: {
    async findUnique({ where }: { where: { eventId_userId: { eventId: string; userId: string } } }) {
      const waiver = waivers.find(
        (candidate) =>
          candidate.eventId === where.eventId_userId.eventId &&
          candidate.userId === where.eventId_userId.userId
      );
      return waiver ? clone(waiver) : null;
    },
  },
  ticketSale: {
    async findFirst({ where }: { where: { eventId?: string; buyerId?: string } }) {
      const sale = ticketSales.find((candidate) => {
        if (where.eventId && candidate.eventId !== where.eventId) return false;
        if (where.buyerId && candidate.buyerId !== where.buyerId) return false;
        return true;
      });
      return sale ? clone(sale) : null;
    },
  },
  eventReview: {
    async findMany({ where, include, orderBy, skip = 0, take }: any) {
      let items = eventReviews.filter((review) => review.eventId === where.eventId);
      if (where.status) {
        items = items.filter((review) => review.status === where.status);
      }
      if (orderBy?.createdAt === 'desc') {
        items = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      if (skip) {
        items = items.slice(skip);
      }
      if (typeof take === 'number') {
        items = items.slice(0, take);
      }
      return items.map((review) => {
        const result: any = clone(review);
        if (include?.user) {
          result.user = includeUser(review.userId, true);
        }
        return result;
      });
    },
    async count({ where }: any) {
      return eventReviews.filter((review) => {
        if (review.eventId !== where.eventId) return false;
        if (where.status && review.status !== where.status) return false;
        return true;
      }).length;
    },
    async upsert({ where, create, update }: any) {
      const index = eventReviews.findIndex(
        (review) =>
          review.eventId === where.eventId_userId.eventId &&
          review.userId === where.eventId_userId.userId
      );
      if (index >= 0) {
        const next = { ...eventReviews[index], ...update };
        eventReviews[index] = next;
        return clone(next);
      }
      const next: EventReview = {
        id: create.id ?? createId('review'),
        eventId: create.eventId,
        userId: create.userId,
        rating: create.rating,
        comment: create.comment,
        status: create.status ?? EventReviewStatus.PENDING,
        createdAt: new Date(),
      };
      eventReviews.push(next);
      return clone(next);
    },
    async update({ where, data }: any) {
      const index = eventReviews.findIndex((review) => review.id === where.id);
      if (index === -1) {
        throw new Error('Review not found');
      }
      const next = { ...eventReviews[index], ...data };
      eventReviews[index] = next;
      return clone(next);
    },
    async groupBy({ where }: any) {
      const items = eventReviews.filter((review) => {
        if (review.eventId !== where.eventId) return false;
        if (where.status && review.status !== where.status) return false;
        return true;
      });
      if (items.length === 0) {
        return [];
      }
      const total = items.reduce((sum, review) => sum + review.rating, 0);
      return [
        {
          _avg: { rating: total / items.length },
          _count: { _all: items.length },
        },
      ];
    },
  },
  eventChatMessage: {
    async findMany({ where, include, orderBy, take }: any) {
      let items = eventChatMessages.filter((message) => message.eventId === where.eventId);
      if (orderBy?.createdAt === 'desc') {
        items = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        items = [...items].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      }
      if (typeof take === 'number') {
        items = items.slice(-take);
      }
      return items.map((message) => {
        const result: any = clone(message);
        if (include?.sender) {
          result.sender = includeUser(message.senderId, true);
        }
        return result;
      });
    },
    async create({ data, include }: any) {
      const next: EventChatMessage = {
        id: createId('chat'),
        createdAt: new Date(),
        ...data,
      };
      eventChatMessages.push(next);
      const result: any = clone(next);
      if (include?.sender) {
        result.sender = includeUser(next.senderId, true);
      }
      return result;
    },
  },
  thread: {
    async findMany({ where = {}, include, orderBy }: any) {
      let items = threads;
      if (where.OR) {
        const scopes = where.OR.filter(Boolean).map((condition: any) => condition?.roleScope);
        items = items.filter((thread) => scopes.includes(thread.roleScope) || scopes.includes(ThreadScope.ALL));
      }
      let ordered = [...items];
      if (orderBy?.updatedAt === 'desc') {
        ordered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      }
      return ordered.map((thread) => buildThread(thread, include));
    },
    async findUnique({ where, include }: any) {
      const thread = threads.find((candidate) => candidate.id === where.id);
      return thread ? buildThread(thread, include) : null;
    },
    async create({ data }: any) {
      const thread: Thread = {
        id: createId('thread'),
        title: data.title,
        body: data.body,
        authorId: data.authorId,
        roleScope: data.roleScope ?? ThreadScope.ALL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      threads.push(thread);
      if (data.posts?.create) {
        for (const postInput of data.posts.create) {
          posts.push({
            id: createId('post'),
            threadId: thread.id,
            authorId: postInput.authorId,
            body: postInput.body,
            createdAt: new Date(),
          });
        }
      }
      return buildThread(thread, data.include ?? {});
    },
    async update({ where, data }: any) {
      const index = threads.findIndex((thread) => thread.id === where.id);
      if (index === -1) {
        throw new Error('Thread not found');
      }
      const next = { ...threads[index], ...data, updatedAt: new Date() };
      threads[index] = next;
      return buildThread(next, data.include ?? {});
    },
    async delete({ where }: any) {
      const index = threads.findIndex((thread) => thread.id === where.id);
      if (index === -1) {
        throw new Error('Thread not found');
      }
      const [removed] = threads.splice(index, 1);
      return clone(removed);
    },
  },
  post: {
    async create({ data }: any) {
      const post: Post = {
        id: createId('post'),
        threadId: data.threadId,
        authorId: data.authorId,
        body: data.body,
        createdAt: new Date(),
      };
      posts.push(post);
      const threadIndex = threads.findIndex((thread) => thread.id === data.threadId);
      if (threadIndex >= 0) {
        threads[threadIndex] = { ...threads[threadIndex], updatedAt: new Date() };
      }
      return clone(post);
    },
    async findMany({ where, include, orderBy }: any) {
      let items = posts.filter((post) => post.threadId === where.threadId);
      if (orderBy?.createdAt === 'asc') {
        items = [...items].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      } else if (orderBy?.createdAt === 'desc') {
        items = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      return items.map((post) => {
        const result: any = clone(post);
        if (include?.author) {
          result.author = includeUser(post.authorId, true);
        }
        return result;
      });
    },
  },
  reaction: {
    async findFirst({ where }: any) {
      const reaction = reactions.find((candidate) => {
        if (where.entityType && candidate.entityType !== where.entityType) return false;
        if (where.entityId && candidate.entityId !== where.entityId) return false;
        if (where.userId && candidate.userId !== where.userId) return false;
        return true;
      });
      return reaction ? clone(reaction) : null;
    },
    async delete({ where }: any) {
      const index = reactions.findIndex((reaction) => reaction.id === where.id);
      if (index === -1) {
        throw new Error('Reaction not found');
      }
      const [removed] = reactions.splice(index, 1);
      return clone(removed);
    },
    async create({ data }: any) {
      const reaction: Reaction = {
        id: createId('reaction'),
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        kind: data.kind ?? ReactionKind.LIKE,
      };
      reactions.push(reaction);
      return clone(reaction);
    },
  },
  mediaComment: {
    async findMany({ where, include, orderBy }: any) {
      let items = mediaComments.filter((comment) => comment.mediaId === where.mediaId);
      if (orderBy?.createdAt === 'desc') {
        items = [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      return items.map((comment) => {
        const result: any = clone(comment);
        if (include?.user) {
          result.user = includeUser(comment.userId, true);
        }
        return result;
      });
    },
    async create({ data }: any) {
      const comment: MediaComment = {
        id: createId('media-comment'),
        mediaId: data.mediaId,
        userId: data.userId,
        body: data.body,
        createdAt: new Date(),
      };
      mediaComments.push(comment);
      return clone(comment);
    },
  },
  $disconnect: async () => {},
};

function buildThread(thread: Thread, include: any = {}) {
  const result: any = clone(thread);
  if (include.author) {
    result.author = includeUser(thread.authorId, true);
  }
  if (include.posts) {
    const postsForThread = posts.filter((post) => post.threadId === thread.id);
    const ordered = include.posts.orderBy?.createdAt === 'desc'
      ? [...postsForThread].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      : [...postsForThread].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    result.posts = ordered.map((post) => {
      const postResult: any = clone(post);
      if (include.posts.include?.author) {
        postResult.author = includeUser(post.authorId, true);
      }
      return postResult;
    });
  }
  return result;
}
