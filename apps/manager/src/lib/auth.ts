import { createClient } from '@krak/auth/client';

import { env } from '@/env';

const apiUrl =
    typeof window === 'undefined' ? (env.KRAK_API_URL ?? env.NEXT_PUBLIC_KRAK_API_URL) : env.NEXT_PUBLIC_KRAK_API_URL;

const authClient = createClient(apiUrl);

export const { signIn, signOut, useSession } = authClient;
