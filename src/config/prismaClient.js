// import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from '@prisma/client';

const log = ['info', 'warn', 'error'];
export const prisma = new PrismaClient({
  log,
});
