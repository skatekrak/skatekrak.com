import { z } from 'zod';

const envSchema = z.object({
    CARRELAGE_URL: z.string(),
    ADMIN_TOKEN: z.string(),
    DISCORD_HOOK_URL: z.string(),
    MONGODB_URI: z.string(),
});

const createEnv = () => {
    const env = envSchema.safeParse(process.env);
    if (!env.success) {
        throw new Error(`Invalid environment variables: ${env.error.issues.map((i) => i.message).join(', ')}`);
    }
    return env.data;
};

export const env = createEnv();
