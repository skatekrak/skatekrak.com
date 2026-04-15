import { ORPCError } from '@orpc/server';

import type { Prisma, ClipProvider } from '@krak/prisma';

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

// ============================================================================
// admin.overview — Aggregate platform counts
// ============================================================================

export const overview = os.admin.overview
    .use(authed)
    .use(admin)
    .handler(async ({ context }) => {
        const [totalUsers, totalSpots, totalMedia, totalClips] = await Promise.all([
            context.prisma.user.count(),
            context.prisma.spot.count(),
            context.prisma.media.count(),
            context.prisma.clip.count(),
        ]);

        return { totalUsers, totalSpots, totalMedia, totalClips };
    });

// ============================================================================
// admin.spots.list — Paginated, sortable spot listing for admin dashboard
// ============================================================================

export const listSpots = os.admin.spots.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.SpotWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [spots, total] = await Promise.all([
            context.prisma.spot.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    type: true,
                    status: true,
                    addedBy: {
                        select: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
                    createdAt: true,
                },
            }),
            context.prisma.spot.count({ where }),
        ]);

        return {
            spots: spots.map((spot) => ({
                id: spot.id,
                name: spot.name,
                city: spot.city,
                country: spot.country,
                type: spot.type,
                status: spot.status,
                addedBy: spot.addedBy ? { username: spot.addedBy.user.username } : null,
                createdAt: spot.createdAt,
            })),
            total,
            page,
            perPage,
        };
    });

// ============================================================================
// admin.media.list — Paginated, sortable media listing for admin dashboard
// ============================================================================

export const listMedia = os.admin.media.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, type } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.MediaWhereInput = {};

        if (type) {
            where.type = type;
        }

        const [media, total] = await Promise.all([
            context.prisma.media.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    type: true,
                    caption: true,
                    image: true,
                    spot: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    addedBy: {
                        select: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
                    createdAt: true,
                },
            }),
            context.prisma.media.count({ where }),
        ]);

        return {
            media: media.map((m) => ({
                id: m.id,
                type: m.type,
                caption: m.caption,
                image: m.image as any,
                spot: m.spot ? { id: m.spot.id, name: m.spot.name } : null,
                addedBy: m.addedBy ? { username: m.addedBy.user.username } : null,
                createdAt: m.createdAt,
            })),
            total,
            page,
            perPage,
        };
    });

// ============================================================================
// admin.clips.list — Paginated, sortable clip listing for admin dashboard
// ============================================================================

export const listClips = os.admin.clips.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder } = input;
        const skip = (page - 1) * perPage;

        const [clips, total] = await Promise.all([
            context.prisma.clip.findMany({
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    title: true,
                    provider: true,
                    videoURL: true,
                    thumbnailURL: true,
                    spot: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    addedBy: {
                        select: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
                    createdAt: true,
                },
            }),
            context.prisma.clip.count(),
        ]);

        return {
            clips: clips.map((c) => ({
                id: c.id,
                title: c.title,
                provider: c.provider as ClipProvider,
                videoURL: c.videoURL,
                thumbnailURL: c.thumbnailURL,
                spot: c.spot ? { id: c.spot.id, name: c.spot.name } : null,
                addedBy: c.addedBy ? { username: c.addedBy.user.username } : null,
                createdAt: c.createdAt,
            })),
            total,
            page,
            perPage,
        };
    });
