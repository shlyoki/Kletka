import { Role } from '@prisma/client';

async function main() {
  console.warn('Seed script is disabled in this mock environment.');
  console.warn(`Default demo user role: ${Role.ORGANIZER}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
