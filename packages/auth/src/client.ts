import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const createClient = (baseURL?: string) => {
    const client = createAuthClient({
        baseURL,
        plugins: [usernameClient(), adminClient()],
    });

    return client;
};

export type AuthClient = ReturnType<typeof createClient>;
