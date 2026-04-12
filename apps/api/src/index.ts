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
import { sendEmail } from './helpers/mail';

const CORS_ORIGIN = /^https:\/\/(\w+\.)?skatekrak\.com$/;

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const auth = createAuth(prisma, {
    baseURL: env.BETTER_AUTH_BASE_URL,
    sendResetPassword: async ({ user, url }) => {
        sendEmail({
            from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_EMAIL}>`,
            to: user.email,
            subject: 'Krak password reset',
            html:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.<br/><br/>` +
                'Please click on the following link, or paste this into your browser to complete the process:<br/><br/>' +
                `<a href="${url}">${url}</a><br/><br/>` +
                'Be aware that the link is only active for <strong>1 hour</strong><br/><br/>' +
                'If you did not request this, please ignore this email and your password will remain unchanged.',
        });
    },
});

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
    .use(cors({ origin: CORS_ORIGIN, credentials: true }))
    .all('/api/auth/*', ({ request }) => auth.handler(request))
    .all(
        '/rpc/*',
        async ({ request }: { request: Request }) => {
            const origin = request.headers.get('origin');
            const allowedOrigin = origin && CORS_ORIGIN.test(origin) ? origin : null;

            if (request.method === 'OPTIONS') {
                return new Response(null, {
                    status: 204,
                    headers: {
                        ...(allowedOrigin && {
                            'Access-Control-Allow-Origin': allowedOrigin,
                            'Access-Control-Allow-Credentials': 'true',
                        }),
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                        'Access-Control-Allow-Headers': request.headers.get('access-control-request-headers') ?? '',
                        'Access-Control-Max-Age': '86400',
                    },
                });
            }

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

            const res = response ?? new Response('Not Found', { status: 404 });
            if (allowedOrigin) {
                res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
                res.headers.set('Access-Control-Allow-Credentials', 'true');
            }
            return res;
        },
        { parse: 'none' },
    )
    .get('/', () => ({ message: 'krak-api' }));

app.listen(3000);
console.log('Server running on :3000');
