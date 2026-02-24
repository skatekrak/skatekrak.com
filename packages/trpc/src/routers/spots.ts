import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import {
    type SpotGeoJSON,
    type SpotOverview,
    type Spot,
    type Media,
    type Clip,
    Status,
    Types,
} from '@krak/carrelage-client';
import type {
    Spot as PrismaSpot,
    Media as PrismaMedia,
    Clip as PrismaClip,
    Profile as PrismaProfile,
} from '@krak/prisma';

// ============================================================================
// Prisma -> Carrelage-client type formatters
// ============================================================================

type SpotWithAddedBy = PrismaSpot & { addedBy: PrismaProfile };
type MediaWithRelations = PrismaMedia & { addedBy: PrismaProfile; spot?: PrismaSpot | null };
type ClipWithRelations = PrismaClip & { addedBy: PrismaProfile; spot?: PrismaSpot | null };

function formatPrismaSpot(spot: SpotWithAddedBy): Spot {
    return {
        id: spot.id,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        className: 'Spot',
        name: spot.name,
        location: {
            streetName: spot.streetName ?? '',
            streetNumber: spot.streetNumber ?? '',
            city: spot.city ?? '',
            country: spot.country ?? '',
            longitude: spot.longitude,
            latitude: spot.latitude,
        },
        geo: [spot.longitude, spot.latitude],
        geoHash: '',
        type: spot.type.toLowerCase() as Types,
        status: spot.status.toLowerCase() as Status,
        description: spot.description ?? '',
        indoor: spot.indoor,
        openingHours: spot.openingHours,
        phone: spot.phone ?? '',
        website: spot.website ?? '',
        instagram: spot.instagram ?? '',
        snapchat: spot.snapchat ?? '',
        facebook: spot.facebook ?? '',
        addedBy: formatPrismaProfile(spot.addedBy),
        coverURL: spot.coverURL ?? '',
        commentsStat: formatStat(spot.commentsStat),
        comments: [],
        mediasStat: formatStat(spot.mediasStat),
        clipsStat: formatStat(spot.clipsStat),
        tricksDoneStat: formatStat(spot.tricksDoneStat),
        tags: spot.tags,
    };
}

function formatPrismaMedia(media: MediaWithRelations): Media {
    return {
        id: media.id,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
        type: media.type.toLowerCase() as 'image' | 'video',
        caption: media.caption ?? undefined,
        image: media.image as unknown as Media['image'],
        video: (media.video as unknown as Media['video']) ?? undefined,
        addedBy: {
            id: media.addedBy.id,
            username: media.addedBy.id,
            profilePicture: media.addedBy.profilePicture as Media['addedBy']['profilePicture'],
        },
        spot: media.spot ? formatPrismaSpot(media.spot as SpotWithAddedBy) : undefined,
    };
}

function formatPrismaClip(clip: ClipWithRelations): Clip {
    return {
        id: clip.id,
        createdAt: clip.createdAt,
        updatedAt: clip.updatedAt,
        title: clip.title,
        provider: clip.provider.toLowerCase() as Clip['provider'],
        videoURL: clip.videoURL,
        thumbnailURL: clip.thumbnailURL,
        spot: clip.spotId ?? '',
        addedBy: {
            id: clip.addedBy.id,
            username: clip.addedBy.id,
            profilePicture: clip.addedBy.profilePicture as Clip['addedBy']['profilePicture'],
        },
    };
}

function formatPrismaProfile(profile: PrismaProfile) {
    return {
        id: profile.id,
        username: profile.id,
        profilePicture: profile.profilePicture,
    } as any;
}

function formatStat(stat: any) {
    if (!stat) {
        return { createdAt: new Date(), className: 'Stat', all: 0, monthly: 0, weekly: 0, daily: 0 };
    }
    return stat;
}

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
            include: { addedBy: true },
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
            include: { addedBy: true },
        });

        if (!spotDoc) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Spot not found' });
        }

        const spot = formatPrismaSpot(spotDoc);

        const [mostLikedRaw, mediaDocs, clipDocs] = await Promise.all([
            // Most liked image media for this spot (sort by JSON likesStat.all via raw SQL)
            ctx.prisma.$queryRaw<PrismaMedia[]>`
                SELECT m.*, row_to_json(p.*) as "addedBy"
                FROM media m
                JOIN profiles p ON p.id = m."addedById"
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
                include: { addedBy: true, spot: { include: { addedBy: true } } },
            }),

            // Last 5 clips for this spot
            ctx.prisma.clip.findMany({
                where: { spotId: input.id, createdAt: { lt: now } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { addedBy: true },
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
                include: { addedBy: true },
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
                    include: { addedBy: true },
                });

                return spots.map(formatPrismaSpot);
            }

            const spots = await ctx.prisma.spot.findMany({
                where: { tags: { hasSome: input.tags } },
                include: { addedBy: true },
                take: input.limit,
            });

            return spots.map(formatPrismaSpot);
        }),
});
