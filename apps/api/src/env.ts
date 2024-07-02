import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        CARRELAGE_URL: z.string(),
        ADMIN_TOKEN: z.string(),
        DISCORD_HOOK_URL: z.string(),
    },
    runtimeEnv: {
        CARRELAGE_URL: process.env.CARRELAGE_URL,
        ADMIN_TOKEN: process.env.ADMIN_TOKEN,
        DISCORD_HOOK_URL: process.env.DISCORD_HOOK_URL,
    },
});
