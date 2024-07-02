import { trpc } from '@elysiajs/trpc';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { logger } from '@bogeychan/elysia-logger';
import { cron } from '@elysiajs/cron';

import { appRouter, createContext } from '@krak/trpc';
import { endOfWeek, startOfWeek, sub } from 'date-fns';
import { env } from './env';

const app = new Elysia()
    .use(logger())
    .use(
        cron({
            name: 'weekly stats',
            pattern: '0 8 * * 1',
            async run() {
                const lastWeekDay = sub(new Date(), { weeks: 1 });
                try {
                    const response = await fetch(
                        `${env.CARRELAGE_URL}/admin/stats?from=${startOfWeek(lastWeekDay, { weekStartsOn: 1 })}&to=${endOfWeek(lastWeekDay, { weekStartsOn: 1 })}`,
                        {
                            method: 'GET',
                            headers: { Authorization: env.ADMIN_TOKEN },
                        },
                    );
                    const stats = await response.json();

                    await fetch(env.DISCORD_HOOK_URL, {
                        method: 'POST',
                        body: JSON.stringify({
                            content: `**Last week stats 📈**\nspot: ${stats.spots}\nmedia: ${stats.media}`,
                        }),
                    });
                } catch (err) {
                    console.error('Error fetching weekly stats', err);
                }
            },
        }),
    )
    .use(cors({ origin: /(\w+\.)?skatekrak\.com$/ }))
    .use(trpc(appRouter, { createContext }));

app.listen(3000);
console.log('Server running on :3000');
