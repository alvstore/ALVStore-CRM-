import { PrismaClient } from '@prisma/client';

// Extend the Prisma types to include our models
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new Prisma client instance
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn']
    : ['error'],
});

// In development, use a global variable to preserve the Prisma client across hot reloads
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

// Export all Prisma types for type safety
export * from '@prisma/client';

// Export the Prisma client instance
export { prisma };

// Export the DB type
export type DB = typeof prisma;

// Export a type for the transaction callback
export type PrismaTransaction = Parameters<typeof prisma.$transaction>[0];

// Type for the transaction client
export type TransactionClient = Parameters<PrismaTransaction>[0];
