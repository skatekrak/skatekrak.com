import { createClient } from '@krak/auth/client';

const authClient = createClient(process.env.NEXT_PUBLIC_KRAK_API_URL);

export const { signIn, signUp, signOut, useSession } = authClient;
