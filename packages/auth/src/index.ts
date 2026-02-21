import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { hash, compare } from 'bcrypt';

import { PrismaClient } from '@krak/prisma';

const BCRYPT_ROUNDS = 10;

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        password: {
            hash: (password) => hash(password, BCRYPT_ROUNDS),
            verify: ({ password, hash: storedHash }) => compare(password, storedHash),
        },
    },
    user: {
        modelName: 'User', // Prisma model name (mapped to "users" table via @@map)
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'USER',
                input: false, // don't allow user to set role on signup
            },
        },
    },
    session: {
        modelName: 'Session',
    },
    account: {
        modelName: 'Account',
    },
    verification: {
        modelName: 'Verification',
    },
    plugins: [username()],
});

export type Auth = typeof auth;
