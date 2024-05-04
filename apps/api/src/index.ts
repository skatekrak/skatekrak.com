import { trpc } from '@elysiajs/trpc';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { logger } from '@bogeychan/elysia-logger';

import { appRouter, createContext } from '@krak/trpc';

const app = new Elysia()
    .use(logger())
    .use(cors({ origin: /(\w+\.)?skatekrak\.com$/ }))
    .use(trpc(appRouter, { createContext }));
app.listen(3000);
console.log('Server running on :3000');
