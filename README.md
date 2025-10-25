# MMA Friends League (Prototype)

[![Open in Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/mma-friends-league&project-name=mma-friends-league&repository-name=mma-friends-league)

A mobile-first Next.js PWA for planning friendly combat-sport events among friends. The UI covers fighter profiles, matchmaking, event management, scoring, waivers, chat, and media surfaces.

## Tech stack

- Next.js 14 with App Router
- React 18 & TypeScript
- Tailwind CSS
- Headless UI and Heroicons

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the flows:

- `/signup` – onboarding with medical privacy fields
- `/` – home feed with upcoming events and notifications
- `/events` – event catalog; `/events/e1` for details
- `/create-event` – multi-step event builder
- `/matchmaking` – filter fighters and suggest bouts
- `/bouts/b1` – judge scoring interface and coordination chat
- `/messages` – event and bout threads
- `/dashboard` – organizer operations hub
- `/leaderboards` – friendly ELO rankings
- `/settings` – privacy and notification controls

## Data & next steps

Static mock data lives in `lib/data.ts`. Replace it with live APIs and connect to your auth provider, payments (Stripe), notifications (FCM/SendGrid), storage (S3), and database (Postgres/Prisma) for production.

See `ADMIN_GUIDE.md` for a deeper tour of organizer capabilities.
