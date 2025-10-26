#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL must be set" >&2
  exit 1
fi

pnpm prisma migrate reset --force --skip-seed
pnpm prisma db push
pnpm prisma db seed
