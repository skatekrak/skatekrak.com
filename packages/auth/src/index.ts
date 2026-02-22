import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import { hash, compare } from 'bcrypt';

import type { PrismaClient } from '@krak/prisma';

const BCRYPT_ROUNDS = 10;

export const createAuth = (prisma: PrismaClient, baseURL?: string) =>
    betterAuth({
        baseURL,
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
            modelName: 'User',
            additionalFields: {
                role: {
                    type: 'string',
                    required: false,
                    defaultValue: 'USER',
                    input: false,
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
        plugins: [
            username({
                minUsernameLength: 1,
            }),
        ],
    });

export type Auth = ReturnType<typeof createAuth>;
