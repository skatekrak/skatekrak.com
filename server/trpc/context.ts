import { CreateNextContextOptions, NextApiRequest } from '@trpc/server/adapters/next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
client.connect();

export const createContext = async ({ req }: CreateNextContextOptions) => {
    return {
        headers: req.headers as NextApiRequest['headers'] | null,
        db: client.db('carrelage'),
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
