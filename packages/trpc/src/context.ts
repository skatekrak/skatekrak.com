import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { MongoClient } from 'mongodb';
import type { PrismaClient } from '@krak/prisma';

export const createContext =
    (mongoClient: MongoClient, prisma: PrismaClient) =>
    async ({ req }: FetchCreateContextFnOptions) => {
        return {
            headers: req.headers,
            db: mongoClient.db('carrelage'),
            prisma,
        };
    };

export type Context = Awaited<ReturnType<typeof createContext>>;
