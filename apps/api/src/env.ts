import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

export const env = createEnv({
    server: {
        DISCORD_HOOK_URL: z.string(),
        DATABASE_URL: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_BASE_URL: z.string(),
        GOOGLE_KEY: z.string(),
        VIMEO_AUTH: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
