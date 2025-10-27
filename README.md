# MMA Friends League

[![Open in Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/mma-friends-league&project-name=mma-friends-league&repository-name=mma-friends-league)
[![CI](https://github.com/your-org/mma-friends-league/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/mma-friends-league/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A mobile-first Next.js 14 platform for running friendly MMA, boxing, kickboxing, and grappling events with safety-first workflows.

## Features
- **Event management** – create fight nights, manage cards, waivers, and safety checklists.
- **Event feedback** – attendees submit reviews with organizer moderation and aggregated ratings.
- **Leaderboards & analytics** – filterable fighter rankings with win/ELO trends and organizer ROI dashboards.
- **Community hub** – scoped discussion forums, reactions, media comments, and real-time event chat.
- **Fighter profiles** – rich bios with attributes, gallery, growth charts, and privacy toggles.
- **Role onboarding** – first-login wizard clarifies roles and routes users to the right dashboard.

## Tech stack
- [Next.js 14](https://nextjs.org/) App Router (React 18, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) + custom gradient shell
- [Prisma](https://www.prisma.io/) ORM with PostgreSQL
- [NextAuth.js](https://next-auth.js.org/) with Google + credentials
- [shadcn/ui primitives](https://ui.shadcn.com/) + Radix UI toasts
- [Vitest](https://vitest.dev/) for unit testing
- GitHub Actions CI, Dependabot, Changesets

## Architecture
```
app/                # App Router routes (server & client components)
app/api/*           # Route handlers for reviews, leaderboards, analytics, community, chat
components/         # UI building blocks (cards, charts, toasts)
lib/                # Prisma client, auth helpers, profanity filter, rate limiter
prisma/schema.prisma# Data model for users, events, bouts, reviews, community, analytics
scripts/db-reset.sh # Convenience script for resetting the database
```

![Dashboard mock](public/og-image.png)

## Getting started
1. Install [pnpm](https://pnpm.io/) and Node.js (see `.nvmrc`).
2. Copy `.env.example` to `.env.local` and update secrets.
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Generate the Prisma client and seed data:
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   pnpm db:seed
   ```
5. Run the development server:
   ```bash
   pnpm dev
   ```
6. Visit `http://localhost:3000`.

### Seed owner login

Use the seeded owner credentials to access organizer-only tooling:

- Email: `denisdimdim@gmail.com`
- Password: `Admin123`

All newly created accounts begin as guests. Promote them from the **Members** screen once they have signed up.

## Available scripts
- `pnpm dev` – start Next.js in development mode
- `pnpm build` – production build
- `pnpm start` – start the built app
- `pnpm lint` – run ESLint
- `pnpm typecheck` – TypeScript project check
- `pnpm test` – Vitest unit tests
- `pnpm prisma:migrate` – create new migrations
- `pnpm db:seed` – populate local database

## Continuous integration
GitHub Actions runs on every PR and push to `main`:
- pnpm install + cache
- Typecheck, lint, test, build
- `prisma validate` and `prisma migrate deploy`
- Summary output for quick triage

A companion workflow posts preview comments with build insights, and Dependabot tracks npm/GitHub Action updates weekly.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching strategy, conventional commit rules, and testing expectations. CODEOWNERS define reviewers per area, and Husky + lint-staged enforce formatting on commit.

## License
MIT © MMA Friends League contributors
