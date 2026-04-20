import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        PORT: z.coerce.number(),
        DISCORD_HOOK_URL: z.string(),
        DATABASE_URL: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_BASE_URL: z.string(),
        GOOGLE_KEY: z.string(),
        VIMEO_AUTH: z.string(),
        CLOUDINARY_CLOUD_NAME: z.string(),
        CLOUDINARY_API_KEY: z.string(),
        CLOUDINARY_SECRET_KEY: z.string(),
        MEILI_HOST: z.string(),
        MEILI_ADMIN_KEY: z.string(),
        MAILGUN_KEY: z.string(),
        MAILGUN_DOMAIN: z.string(),
        MAIL_FROM_NAME: z.string(),
        MAIL_FROM_EMAIL: z.string(),
        S3_ENDPOINT: z.string(),
        S3_REGION: z.string(),
        S3_BUCKET: z.string(),
        S3_ACCESS_KEY: z.string(),
        S3_SECRET_KEY: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
