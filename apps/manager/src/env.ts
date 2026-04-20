import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        KRAK_API_URL: z.url().optional(),
    },
    client: {
        NEXT_PUBLIC_KRAK_API_URL: z.url(),
        NEXT_PUBLIC_IMGPROXY_URL: z.url().optional(),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_KRAK_API_URL: process.env.NEXT_PUBLIC_KRAK_API_URL,
        NEXT_PUBLIC_IMGPROXY_URL: process.env.NEXT_PUBLIC_IMGPROXY_URL,
    },
    emptyStringAsUndefined: true,
});
