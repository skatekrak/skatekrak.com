import { PrismaClient } from '@krak/prisma';
import { createAuth } from '@krak/auth';

const prisma = new PrismaClient();

export const auth = createAuth(prisma);
