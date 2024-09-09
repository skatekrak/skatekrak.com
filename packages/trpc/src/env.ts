import { z } from 'zod';

const envSchema = z.object({
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
