import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';

export const createClient = (baseURL?: string) => {
    const client = createAuthClient({
        baseURL,
        plugins: [usernameClient()],
    });

    return client;
};

export type AuthClient = ReturnType<typeof createClient>;
