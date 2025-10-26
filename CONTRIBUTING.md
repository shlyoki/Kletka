# Contributing to MMA Friends League

Thank you for your interest in contributing! This guide outlines how to set up your environment, follow our branching strategy, and submit changes using conventional commits.

## Local setup
1. Install [pnpm](https://pnpm.io/) and Node.js (see `.nvmrc`).
2. Copy `.env.example` to `.env.local` and update secrets.
3. Install dependencies: `pnpm install`.
4. Generate Prisma client: `pnpm prisma generate`.
5. Apply migrations: `pnpm prisma migrate dev`.
6. Seed data: `pnpm db:seed`.
7. Run the development server: `pnpm dev`.

## Branching & pull requests
- Create feature branches from `main` using the pattern `feat/<short-description>` or `fix/<short-description>`.
- Keep commits scoped and reference issues in your PR description.
- Push your branch and open a PR using the template; ensure CI passes before requesting review.

## Conventional commits
Use [Conventional Commits](https://www.conventionalcommits.org/) to write your messages. Examples:
- `feat: add event feedback moderation`
- `fix: correct leaderboard filter state`
- `chore: bump dependencies`

## Pre-commit hooks
We use Husky and lint-staged to enforce formatting and linting. Hooks run automatically on `git commit`. If they fail, fix the reported issues and retry.

## Testing checklist
Before requesting review:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm prisma migrate deploy --preview-feature`

## Reporting issues
Use the issue templates for bugs and feature requests in `.github/ISSUE_TEMPLATE/`.
