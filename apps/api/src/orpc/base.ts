import { implement, ORPCError } from '@orpc/server';
import type { PrismaClient, Session, User } from '@krak/prisma';

import { contract } from '@krak/contracts';

// ============================================================================
// Auth session type
// ============================================================================

export type AuthSession = {
    session: Session;
    user: User;
} | null;

// ============================================================================
// Context
// ============================================================================

export type Context = {
    headers: Headers;
    prisma: PrismaClient;
    session: AuthSession;
};

// ============================================================================
// Implementer + middleware
// ============================================================================

export const os = implement(contract).$context<Context>();

export const authed = os.middleware(async ({ context, next }) => {
    if (!context.session) {
        throw new ORPCError('UNAUTHORIZED', { message: 'Not authenticated' });
    }

    return next({
        context: {
            session: context.session,
        },
    });
});
