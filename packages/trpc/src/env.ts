import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        MONGODB_URI: z.string(),
    },
    runtimeEnv: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
});
