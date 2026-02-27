import { implement, ORPCError } from '@orpc/server';
import type { PrismaClient, Profile, Spot, Session, User } from '@krak/prisma';

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

/**
 * Resolves the authenticated user's profile from the session.
 * Must be chained after `authed` (requires `context.session` to be non-null).
 */
export const loadProfile = os.middleware(async ({ context, next }, _input: unknown) => {
    const session = context.session;
    if (!session) {
        throw new ORPCError('UNAUTHORIZED', { message: 'Not authenticated' });
    }

    const profile = await context.prisma.profile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        throw new ORPCError('NOT_FOUND', { message: 'Profile not found' });
    }

    return next({
        context: { profile } satisfies { profile: Profile },
    });
});

/**
 * Loads a spot by `input.spotId` and adds it to the context.
 * Works with any procedure whose input contains `{ spotId: string }`.
 */
export const loadSpot = os.middleware(async ({ context, next }, input: { spotId: string }) => {
    const spot = await context.prisma.spot.findUnique({
        where: { id: input.spotId },
    });

    if (!spot) {
        throw new ORPCError('NOT_FOUND', { message: 'Spot not found' });
    }

    return next({
        context: { spot } satisfies { spot: Spot },
    });
});
