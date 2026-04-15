import type { Prisma } from '@krak/prisma';
import { ORPCError } from '@orpc/server';

import { os, authed, admin } from '../base';

// ============================================================================
// admin.users.list — Paginated, sortable user listing for admin dashboard
// ============================================================================

export const listUsers = os.admin.users.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search, role, banned } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        if (banned !== undefined) {
            where.banned = banned;
        }

        const [users, total] = await Promise.all([
            context.prisma.user.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    email: true,
                    role: true,
                    banned: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            context.prisma.user.count({ where }),
        ]);

        return {
            users,
            total,
            page,
            perPage,
        };
    });

// ============================================================================
// admin.users.getByUsername — Full user detail with profile and accounts
// ============================================================================

export const getUserByUsername = os.admin.users.getByUsername
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const user = await context.prisma.user.findUnique({
            where: { username: input.username },
            include: {
                profile: true,
                accounts: true,
            },
        });

        if (!user) {
            throw new ORPCError('NOT_FOUND', { message: `User '${input.username}' not found` });
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                displayUsername: user.displayUsername,
                email: user.email,
                emailVerified: user.emailVerified,
                name: user.name,
                image: user.image,
                role: user.role,
                banned: user.banned,
                banReason: user.banReason,
                banExpires: user.banExpires,
                receiveNewsletter: user.receiveNewsletter,
                welcomeMailSent: user.welcomeMailSent,
                subscriptionStatus: user.subscriptionStatus,
                stripeCustomerId: user.stripeCustomerId,
                subscriptionEndAt: user.subscriptionEndAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            profile: user.profile
                ? {
                      id: user.profile.id,
                      description: user.profile.description,
                      location: user.profile.location,
                      stance: user.profile.stance,
                      snapchat: user.profile.snapchat,
                      instagram: user.profile.instagram,
                      website: user.profile.website,
                      sponsors: user.profile.sponsors,
                      profilePicture: user.profile.profilePicture as any,
                      banner: user.profile.banner as any,
                      followersStat: user.profile.followersStat as any,
                      followingStat: user.profile.followingStat as any,
                      spotsFollowingStat: user.profile.spotsFollowingStat as any,
                      mediasStat: user.profile.mediasStat as any,
                      clipsStat: user.profile.clipsStat as any,
                      tricksDoneStat: user.profile.tricksDoneStat as any,
                      createdAt: user.profile.createdAt,
                      updatedAt: user.profile.updatedAt,
                  }
                : null,
            accounts: user.accounts.map((account) => ({
                id: account.id,
                accountId: account.accountId,
                providerId: account.providerId,
                hasAccessToken: account.accessToken != null,
                hasRefreshToken: account.refreshToken != null,
                accessTokenExpiresAt: account.accessTokenExpiresAt,
                refreshTokenExpiresAt: account.refreshTokenExpiresAt,
                scope: account.scope,
                hasIdToken: account.idToken != null,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            })),
        };
    });
