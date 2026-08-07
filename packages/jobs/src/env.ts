import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        DATABASE_URL: z.string(),
        MONGODB_URL: z.string(),
        MONGODB_DATABASE: z.string().default('carrelage'),
        MEILI_HOST: z.string(),
        MEILI_ADMIN_KEY: z.string(),
        DO_CDN_ENDPOINT: z.string(),
        S3_ENDPOINT: z.string().optional(),
        S3_REGION: z.string().optional(),
        S3_BUCKET: z.string().optional(),
        S3_ACCESS_KEY: z.string().optional(),
        S3_SECRET_KEY: z.string().optional(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
