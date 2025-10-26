import { PrismaClient, Role, EventReviewStatus, ThreadScope, BoutResult, BoutMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.eventChatMessage.deleteMany();
  await prisma.mediaComment.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.post.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.ticketSale.deleteMany();
  await prisma.eventExpense.deleteMany();
  await prisma.eventReview.deleteMany();
  await prisma.waiver.deleteMany();
  await prisma.bout.deleteMany();
  await prisma.event.deleteMany();
  await prisma.fighterAttributes.deleteMany();
  await prisma.fighterProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const organizer = await prisma.user.create({
    data: {
      name: 'Olivia Organizer',
      email: 'olivia@example.com',
      role: Role.ORGANIZER,
    },
  });

  const fighterA = await prisma.user.create({
    data: {
      name: 'Diego Alvarez',
      email: 'diego@example.com',
      role: Role.FIGHTER,
      fighter: {
        create: {
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
          attributes: {
            create: { power: 78, cardio: 82, grappling: 74, striking: 85 },
          },
        },
      },
    },
  });

  const fighterB = await prisma.user.create({
    data: {
      name: 'Maya Chen',
      email: 'maya@example.com',
      role: Role.FIGHTER,
      fighter: {
        create: {
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
          attributes: {
            create: { power: 70, cardio: 88, grappling: 69, striking: 90 },
          },
        },
      },
    },
  });

  const event = await prisma.event.create({
    data: {
      title: 'MFL Throwdown',
      description: 'High-energy friendly bouts to close the season.',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      venue: 'MFL Arena',
      organizerId: organizer.id,
      ruleset: 'MMA',
      bouts: {
        create: [
          {
            date: new Date(),
            weightClass: 'Lightweight',
            redFighterId: fighterA.id,
            blueFighterId: fighterB.id,
            result: BoutResult.RED,
            method: BoutMethod.DEC,
            round: 3,
            time: '3:00',
          },
        ],
      },
      reviews: {
        create: [
          {
            userId: fighterA.id,
            rating: 5,
            comment: 'Electric crowd and smooth logistics!'
          },
          {
            userId: fighterB.id,
            rating: 4,
            comment: 'Great matchmaking, could use more warmup mats.',
            status: EventReviewStatus.APPROVED,
          },
        ],
      },
      expenses: {
        create: [
          { category: 'Venue', amount: 1200 },
          { category: 'Insurance', amount: 400 },
          { category: 'Production', amount: 800 },
        ],
      },
      ticketSales: {
        create: [
          { price: 35, qty: 120, channel: 'Online', buyerId: organizer.id },
          { price: 40, qty: 45, channel: 'Door' },
        ],
      },
    },
  });

  await prisma.waiver.create({
    data: {
      eventId: event.id,
      userId: fighterA.id,
    },
  });

  await prisma.thread.create({
    data: {
      title: 'Weigh-in Strategies',
      body: 'Share your best friendly tips to manage weight cuts safely.',
      roleScope: ThreadScope.ALL,
      authorId: fighterA.id,
      posts: {
        create: [
          { authorId: fighterB.id, body: 'Hydration is everything—start early!' },
          { authorId: organizer.id, body: 'Remember to submit your medicals!' },
        ],
      },
    },
  });

  await prisma.mediaItem.create({
    data: {
      ownerId: fighterB.id,
      url: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
      type: 'IMAGE',
      title: 'Post-fight celebration',
      comments: {
        create: [{ userId: fighterA.id, body: 'Legendary night!' }],
      },
    },
  });

  await prisma.eventChatMessage.create({
    data: {
      eventId: event.id,
      senderId: organizer.id,
      role: Role.ORGANIZER,
      body: 'Doors open at 5pm sharp. Check-in desk on the left.',
    },
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
