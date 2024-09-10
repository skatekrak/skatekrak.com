import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

export const env = createEnv({
    server: {
        CARRELAGE_URL: z.string(),
        ADMIN_TOKEN: z.string(),
        DISCORD_HOOK_URL: z.string(),
        MONGODB_URI: z.string(),
    },
    runtimeEnv: Bun.env,
    emptyStringAsUndefined: true,
});
