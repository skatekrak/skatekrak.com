import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { username } from 'better-auth/plugins';
import type { PrismaClient } from '@krak/prisma';

type SendResetPasswordData = {
    user: { email: string; name: string };
    url: string;
    token: string;
};

type CreateAuthOptions = {
    baseURL?: string;
    sendResetPassword?: (data: SendResetPasswordData, request?: Request) => Promise<void>;
};

export const createAuth = (prisma: PrismaClient, options?: CreateAuthOptions) =>
    betterAuth({
        baseURL: options?.baseURL,
        trustedOrigins: ['*.skatekrak.com'],
        database: prismaAdapter(prisma, {
            provider: 'postgresql',
        }),
        emailAndPassword: {
            enabled: true,
            sendResetPassword: options?.sendResetPassword,
            password: {
                hash: (password) => Bun.password.hash(password, 'bcrypt'),
                verify: ({ password, hash: storedHash }) => Bun.password.verify(password, storedHash, 'bcrypt'),
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
