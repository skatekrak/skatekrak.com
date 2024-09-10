import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { MongoClient } from 'mongodb';

export const createContext =
    (mongoClient: MongoClient) =>
    async ({ req }: FetchCreateContextFnOptions) => {
        return {
            headers: req.headers,
            db: mongoClient.db('carrelage'),
        };
    };

export type Context = Awaited<ReturnType<typeof createContext>>;
