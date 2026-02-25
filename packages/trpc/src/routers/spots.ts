import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { type SpotGeoJSON, type SpotOverview, Status, Types } from '@krak/carrelage-client';
import type { Media as PrismaMedia } from '@krak/prisma';
import {
    type SpotWithAddedBy,
    type MediaWithRelations,
    formatPrismaSpot,
    formatPrismaMedia,
    formatPrismaClip,
    formatStat,
} from '../formatters';

// ============================================================================
// Shared Prisma include for addedBy with user relation
// ============================================================================

const addedByInclude = { addedBy: { include: { user: { select: { username: true } } } } } as const;

// ============================================================================
// GeoJSON helper
// ============================================================================

function spotsToGeoJSON(spots: SpotWithAddedBy[]): SpotGeoJSON[] {
    return spots.map((spot) => {
        const status = spot.status.toLowerCase() as Status;
        const type = spot.type.toLowerCase() as Types;
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [spot.longitude, spot.latitude],
            },
            properties: {
                id: spot.id,
                name: spot.name,
                type: status === Status.Active ? type : status,
                indoor: spot.indoor,
                tags: spot.tags,
                mediasStat: formatStat(spot.mediasStat),
            },
        } satisfies SpotGeoJSON;
    });
}

function addHashtagIfNeeded(tag: string) {
    return tag[0] !== '#' ? `#${tag}` : tag;
}

// ============================================================================
// Router
// ============================================================================

export const spotsRouter = router({
    getSpot: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const spot = await ctx.prisma.spot.findUnique({
            where: { id: input.id },
            include: addedByInclude,
        });

        if (!spot) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Spot not found' });
        }

        return formatPrismaSpot(spot);
    }),

    getSpotOverview: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const now = new Date();

        const spotDoc = await ctx.prisma.spot.findUnique({
            where: { id: input.id },
            include: addedByInclude,
        });

        if (!spotDoc) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Spot not found' });
        }

        const spot = formatPrismaSpot(spotDoc);

        const [mostLikedRaw, mediaDocs, clipDocs] = await Promise.all([
            // Most liked image media for this spot (sort by JSON likesStat.all via raw SQL)
            ctx.prisma.$queryRaw<PrismaMedia[]>`
                SELECT m.*, json_build_object(
                    'id', p.id,
                    'userId', p."userId",
                    'profilePicture', p."profilePicture",
                    'user', json_build_object('username', u.username)
                ) as "addedBy"
                FROM media m
                JOIN profiles p ON p.id = m."addedById"
                JOIN users u ON u.id = p."userId"
                WHERE m."spotId" = ${input.id}
                  AND m.type = 'IMAGE'
                ORDER BY (m."likesStat"->>'all')::int DESC NULLS LAST
                LIMIT 1
            `,

            // Last 5 medias for this spot
            ctx.prisma.media.findMany({
                where: {
                    spotId: input.id,
                    createdAt: { lt: now },
                    OR: [{ image: { not: { equals: null } } }, { video: { not: { equals: null } } }],
                    AND: [{ OR: [{ releaseDate: null }, { releaseDate: { lt: now } }] }],
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { addedBy: { include: { user: { select: { username: true } } } }, spot: { include: addedByInclude } },
            }),

            // Last 5 clips for this spot
            ctx.prisma.clip.findMany({
                where: { spotId: input.id, createdAt: { lt: now } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: addedByInclude,
            }),
        ]);

        const medias = mediaDocs.map(formatPrismaMedia);
        const clips = clipDocs.map(formatPrismaClip);
        const mostLikedMedia =
            mostLikedRaw.length > 0
                ? formatPrismaMedia(mostLikedRaw[0] as unknown as MediaWithRelations)
                : undefined;

        return {
            spot,
            medias,
            clips,
            mostLikedMedia,
        } satisfies SpotOverview;
    }),

    getSpotsGeoJSON: publicProcedure
        .input(
            z.object({
                northEast: z.object({ latitude: z.number(), longitude: z.number() }),
                southWest: z.object({ latitude: z.number(), longitude: z.number() }),
            }),
        )
        .query(async ({ ctx, input }) => {
            const spots = await ctx.prisma.spot.findMany({
                where: {
                    longitude: {
                        gte: input.southWest.longitude,
                        lte: input.northEast.longitude,
                    },
                    latitude: {
                        gte: input.southWest.latitude,
                        lte: input.northEast.latitude,
                    },
                },
                include: addedByInclude,
            });

            return spotsToGeoJSON(spots);
        }),

    listByTags: publicProcedure
        .input(
            z.object({
                tags: z.array(z.string()).min(1, 'You must give at least one tag'),
                tagsFromMedia: z.boolean().default(false),
                limit: z.number().default(2000),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (input.tagsFromMedia) {
                // Find spots that have media with matching hashtags
                const medias = await ctx.prisma.media.findMany({
                    where: {
                        hashtags: { hasSome: input.tags.map(addHashtagIfNeeded) },
                        spotId: { not: null },
                    },
                    select: { spotId: true },
                    distinct: ['spotId'],
                    take: input.limit,
                });

                const spotIds = medias.map((m) => m.spotId).filter((id): id is string => id != null);

                if (spotIds.length === 0) return [];

                const spots = await ctx.prisma.spot.findMany({
                    where: { id: { in: spotIds } },
                    include: addedByInclude,
                });

                return spots.map(formatPrismaSpot);
            }

            const spots = await ctx.prisma.spot.findMany({
                where: { tags: { hasSome: input.tags } },
                include: addedByInclude,
                take: input.limit,
            });

            return spots.map(formatPrismaSpot);
        }),
});
