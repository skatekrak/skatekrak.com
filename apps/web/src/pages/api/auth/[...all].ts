import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/server/auth';
import { toNodeHandler } from 'better-auth/node';

const handler = toNodeHandler(auth);

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    return handler(req, res);
}
