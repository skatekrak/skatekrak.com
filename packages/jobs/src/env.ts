import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        DATABASE_URL: z.string(),
        MONGODB_URL: z.string(),
        MONGODB_DATABASE: z.string().default('carrelage'),
        MEILI_HOST: z.string(),
        MEILI_ADMIN_KEY: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
