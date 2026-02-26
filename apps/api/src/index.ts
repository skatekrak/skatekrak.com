import { RPCHandler } from '@orpc/server/fetch';
import { onError } from '@orpc/server';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { logger } from '@bogeychan/elysia-logger';
import { cron } from '@elysiajs/cron';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@krak/prisma';
import { createAuth } from '@krak/auth';

import { router } from './orpc/router';
import type { AuthSession } from './orpc/base';
import { endOfWeek, startOfWeek, sub } from 'date-fns';
import { env } from './env';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const auth = createAuth(prisma, env.BETTER_AUTH_BASE_URL);

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            console.error(error);
        }),
    ],
});

const app = new Elysia()
    .use(logger())
    .use(
        cron({
            name: 'weekly stats',
            pattern: '0 8 * * 1',
            async run() {
                const lastWeekDay = sub(new Date(), { weeks: 1 });
                const from = startOfWeek(lastWeekDay, { weekStartsOn: 1 });
                const to = endOfWeek(lastWeekDay, { weekStartsOn: 1 });

                try {
                    const [spots, media] = await Promise.all([
                        prisma.spot.count({
                            where: { createdAt: { gte: from, lt: to } },
                        }),
                        prisma.media.count({
                            where: { createdAt: { gte: from, lt: to } },
                        }),
                    ]);

                    await fetch(env.DISCORD_HOOK_URL, {
                        method: 'POST',
                        body: JSON.stringify({
                            content: `**Last week stats 📈**\nspot: ${spots}\nmedia: ${media}`,
                        }),
                    });
                } catch (err) {
                    console.error('Error fetching weekly stats', err);
                }
            },
        }),
    )
    .use(cors({ origin: /(\w+\.)?skatekrak\.com$/, credentials: true }))
    .mount(auth.handler)
    .all(
        '/rpc/*',
        async ({ request }: { request: Request }) => {
            const session = (await auth.api.getSession({
                headers: request.headers,
            })) as AuthSession;

            const { response } = await handler.handle(request, {
                prefix: '/rpc',
                context: {
                    headers: request.headers,
                    prisma,
                    session,
                },
            });

            return response ?? new Response('Not Found', { status: 404 });
        },
        { parse: 'none' },
    )
    .get('/', () => ({ message: 'krak-api' }));

app.listen(3000);
console.log('Server running on :3000');
