import { createClient } from '@krak/auth/client';

const apiUrl =
    typeof window === 'undefined'
        ? (process.env.KRAK_API_URL ?? process.env.NEXT_PUBLIC_KRAK_API_URL)
        : process.env.NEXT_PUBLIC_KRAK_API_URL;

const authClient = createClient(apiUrl);

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } = authClient;
