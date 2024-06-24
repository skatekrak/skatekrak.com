import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { MongoClient } from 'mongodb';

if (process.env.MONGODB_URI === undefined) {
    throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(process.env.MONGODB_URI!);
client.connect();

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
    return {
        headers: req.headers,
        db: client.db('carrelage'),
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
