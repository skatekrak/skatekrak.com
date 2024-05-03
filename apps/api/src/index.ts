import { trpc } from '@elysiajs/trpc';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { appRouter, createContext } from '@krak/trpc';

const app = new Elysia().use(cors({ origin: /.?*\.skatekrak\.com$/ })).use(trpc(appRouter, { createContext }));
app.listen(3000);
console.log('Server running on :3000');
