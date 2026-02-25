import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { formatPrismaMedia, formatPrismaClip } from '../formatters';

// ============================================================================
// Shared Prisma include for media relations
// ============================================================================

const mediaInclude = {
    addedBy: true,
    spot: { include: { addedBy: true } },
} as const;

const clipInclude = {
    addedBy: true,
} as const;

// ============================================================================
// Router
// ============================================================================

export const mediaRouter = router({
    /** Get a single media by ID */
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const media = await ctx.prisma.media.findUnique({
            where: { id: input.id },
            include: mediaInclude,
        });

        if (!media) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Media not found' });
        }

        return formatPrismaMedia(media);
    }),

    /** Cursor-paginated medias for a spot (used by infinite scroll) */
    listBySpot: publicProcedure
        .input(
            z.object({
                spotId: z.string(),
                cursor: z.date().optional(),
                limit: z.number().min(1).max(100).default(20),
            }),
        )
        .query(async ({ ctx, input }) => {
            const medias = await ctx.prisma.media.findMany({
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
        }),

    /** Get the previous and next media around a given media for a spot (carousel navigation) */
    getSpotMediasAround: publicProcedure
        .input(
            z.object({
                spotId: z.string(),
                mediaCreatedAt: z.date(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const [prevMedias, nextMedias] = await Promise.all([
                ctx.prisma.media.findMany({
                    where: {
                        spotId: input.spotId,
                        createdAt: { gt: input.mediaCreatedAt },
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 1,
                    include: mediaInclude,
                }),
                ctx.prisma.media.findMany({
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
        }),

    /** General media listing with optional hashtag filter (cursor-paginated) */
    list: publicProcedure
        .input(
            z.object({
                hashtag: z.string().optional(),
                cursor: z.date().optional(),
                limit: z.number().min(1).max(100).default(20),
            }),
        )
        .query(async ({ ctx, input }) => {
            const medias = await ctx.prisma.media.findMany({
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
        }),

    /** Get the previous and next media around a given media for a hashtag (carousel navigation) */
    getHashtagMediasAround: publicProcedure
        .input(
            z.object({
                hashtag: z.string(),
                mediaCreatedAt: z.date(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const [prevMedias, nextMedias] = await Promise.all([
                ctx.prisma.media.findMany({
                    where: {
                        hashtags: { has: input.hashtag },
                        createdAt: { gt: input.mediaCreatedAt },
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 1,
                    include: mediaInclude,
                }),
                ctx.prisma.media.findMany({
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
        }),

    /** Cursor-paginated clips for a spot (used by infinite scroll) */
    listClipsBySpot: publicProcedure
        .input(
            z.object({
                spotId: z.string(),
                cursor: z.date().optional(),
                limit: z.number().min(1).max(100).default(20),
            }),
        )
        .query(async ({ ctx, input }) => {
            const clips = await ctx.prisma.clip.findMany({
                where: {
                    spotId: input.spotId,
                    createdAt: { lt: input.cursor ?? new Date() },
                },
                orderBy: { createdAt: 'desc' },
                take: input.limit,
                include: clipInclude,
            });

            return clips.map(formatPrismaClip);
        }),
});
