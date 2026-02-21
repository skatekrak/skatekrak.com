import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import type { PrismaClient, Session, User } from '@krak/prisma';
import type { Auth } from '@krak/auth';

export type AuthSession = {
    session: Session;
    user: User;
} | null;

export type Context = {
    headers: Headers;
    db: Db;
    prisma: PrismaClient;
    session: AuthSession;
};

export const createContext =
    (mongoClient: MongoClient, prisma: PrismaClient, auth: Auth) =>
    async ({ req }: FetchCreateContextFnOptions): Promise<Context> => {
        const session = (await auth.api.getSession({
            headers: req.headers,
        })) as AuthSession;

        return {
            headers: req.headers,
            db: mongoClient.db('carrelage'),
            prisma,
            session,
        };
    };
