import { ORPCError } from '@orpc/server';

import { os } from '../base';
import { formatPrismaMedia, formatPrismaClip } from '../formatters';

// ============================================================================
// Shared Prisma include for media relations
// ============================================================================

const addedByInclude = { include: { user: { select: { username: true } } } } as const;

const mediaInclude = {
    addedBy: addedByInclude,
    spot: { include: { addedBy: addedByInclude } },
} as const;

const clipInclude = {
    addedBy: addedByInclude,
} as const;

// ============================================================================
// Procedure implementations
// ============================================================================

/** Get a single media by ID */
export const getById = os.media.getById.handler(async ({ context, input }) => {
    const media = await context.prisma.media.findUnique({
        where: { id: input.id },
        include: mediaInclude,
    });

    if (!media) {
        throw new ORPCError('NOT_FOUND', { message: 'Media not found' });
    }

    return formatPrismaMedia(media);
});

/** Cursor-paginated medias for a spot (used by infinite scroll) */
export const listBySpot = os.media.listBySpot.handler(async ({ context, input }) => {
    const medias = await context.prisma.media.findMany({
        where: {
            spotId: input.spotId,
            createdAt: { lt: input.cursor ?? new Date() },
            OR: [{ image: { not: { equals: null } } }, { video: { not: { equals: null } } }],
            AND: [{ OR: [{ releaseDate: null }, { releaseDate: { lt: new Date() } }] }],
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        include: mediaInclude,
    });

    return medias.map(formatPrismaMedia);
});

/** Get the previous and next media around a given media for a spot (carousel navigation) */
export const getSpotMediasAround = os.media.getSpotMediasAround.handler(async ({ context, input }) => {
    const [prevMedias, nextMedias] = await Promise.all([
        context.prisma.media.findMany({
            where: {
                spotId: input.spotId,
                createdAt: { gt: input.mediaCreatedAt },
            },
            orderBy: { createdAt: 'asc' },
            take: 1,
            include: mediaInclude,
        }),
        context.prisma.media.findMany({
            where: {
                spotId: input.spotId,
                createdAt: { lt: input.mediaCreatedAt },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: mediaInclude,
        }),
    ]);

    return {
        prevMedia: prevMedias.length > 0 ? formatPrismaMedia(prevMedias[0]!) : undefined,
        nextMedia: nextMedias.length > 0 ? formatPrismaMedia(nextMedias[0]!) : undefined,
    };
});

/** General media listing with optional hashtag filter (cursor-paginated) */
export const list = os.media.list.handler(async ({ context, input }) => {
    const medias = await context.prisma.media.findMany({
        where: {
            createdAt: { lt: input.cursor ?? new Date() },
            OR: [{ image: { not: { equals: null } } }, { video: { not: { equals: null } } }],
            AND: [
                { OR: [{ releaseDate: null }, { releaseDate: { lt: new Date() } }] },
                ...(input.hashtag ? [{ hashtags: { has: input.hashtag } }] : []),
            ],
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        include: mediaInclude,
    });

    return medias.map(formatPrismaMedia);
});

/** Get the previous and next media around a given media for a hashtag (carousel navigation) */
export const getHashtagMediasAround = os.media.getHashtagMediasAround.handler(async ({ context, input }) => {
    const [prevMedias, nextMedias] = await Promise.all([
        context.prisma.media.findMany({
            where: {
                hashtags: { has: input.hashtag },
                createdAt: { gt: input.mediaCreatedAt },
            },
            orderBy: { createdAt: 'asc' },
            take: 1,
            include: mediaInclude,
        }),
        context.prisma.media.findMany({
            where: {
                hashtags: { has: input.hashtag },
                createdAt: { lt: input.mediaCreatedAt },
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: mediaInclude,
        }),
    ]);

    return {
        prevMedia: prevMedias.length > 0 ? formatPrismaMedia(prevMedias[0]!) : undefined,
        nextMedia: nextMedias.length > 0 ? formatPrismaMedia(nextMedias[0]!) : undefined,
    };
});

/** Cursor-paginated clips for a spot (used by infinite scroll) */
export const listClipsBySpot = os.media.listClipsBySpot.handler(async ({ context, input }) => {
    const clips = await context.prisma.clip.findMany({
        where: {
            spotId: input.spotId,
            createdAt: { lt: input.cursor ?? new Date() },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        include: clipInclude,
    });

    return clips.map(formatPrismaClip);
});
