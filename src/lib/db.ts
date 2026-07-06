import { PrismaClient } from '@prisma/client';

// Force recreate prisma client instance once to pick up the schema update
if (typeof global !== 'undefined' && (global as any).prisma) {
  try {
    (global as any).prisma.$disconnect();
  } catch {}
  delete (global as any).prisma;
}

export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') (global as any).prisma = db;

export default db;
