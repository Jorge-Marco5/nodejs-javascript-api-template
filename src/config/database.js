import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function connectToDatabase() {
  return prisma.$connect();
}
