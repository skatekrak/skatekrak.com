import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        CARRELAGE_URL: z.string(),
    },
    runtimeEnv: {
        CARRELAGE_URL: process.env.CARRELAGE_URL,
    },
});
