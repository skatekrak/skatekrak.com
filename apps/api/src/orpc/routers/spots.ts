import { ORPCError } from '@orpc/server';
import { type SpotGeoJSON, Status, Types } from '@krak/carrelage-client';
import type { Media as PrismaMedia, ClipProvider, SpotType, SpotStatus, Obstacle } from '@krak/prisma';

import { os, authed, loadProfile, loadSpot } from '../base';
import {
    type SpotWithAddedBy,
    type MediaWithRelations,
    formatPrismaSpot,
    formatPrismaMedia,
    formatPrismaClip,
    formatStat,
} from '../formatters';
import { getVideoInformation } from '../../helpers/videos';
import { reverseGeocode } from '../../helpers/geocoding';
import { buildStat } from '../../helpers/stats';
import { spotIndex } from '../../helpers/meilisearch';
import { env } from '../../env';

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
// Procedure implementations
// ============================================================================

export const createSpot = os.spots.create
    .use(authed)
    .use(loadProfile)
    .handler(async ({ context, input }) => {
        const { profile } = context;

        // Reverse-geocode coordinates into a street address
        let location: { streetNumber: string | null; streetName: string | null; city: string | null; country: string | null } = {
            streetNumber: null,
            streetName: null,
            city: null,
            country: null,
        };

        try {
            const geocoded = await reverseGeocode(input.latitude, input.longitude, env.GOOGLE_KEY);
            if (geocoded) {
                location = geocoded;
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }

        // Map lowercase obstacle values to Prisma UPPERCASE enum
        const obstacles = (input.obstacles ?? []).map((o) => o.toUpperCase() as Obstacle);

        // Create spot + auto-follow in a single transaction
        const spot = await context.prisma.$transaction(async (tx) => {
            const created = await tx.spot.create({
                data: {
                    name: input.name,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    type: input.type.toUpperCase() as SpotType,
                    status: input.status ? (input.status.toUpperCase() as SpotStatus) : 'ACTIVE',
                    indoor: input.indoor,
                    description: input.description,
                    phone: input.phone,
                    website: input.website,
                    instagram: input.instagram,
                    snapchat: input.snapchat,
                    facebook: input.facebook,
                    tags: input.tags ?? [],
                    obstacles,
                    streetName: location.streetName,
                    streetNumber: location.streetNumber,
                    city: location.city,
                    country: location.country,
                    addedById: profile.id,
                },
                include: addedByInclude,
            });

            // Auto-follow: creator follows the new spot
            await tx.profileSpotFollow.create({
                data: {
                    profileId: profile.id,
                    spotId: created.id,
                },
            });

            return created;
        });

        // Index the new spot in Meilisearch (fire-and-forget, don't block the response)
        spotIndex
            .addDocuments([
                {
                    objectID: spot.id,
                    name: spot.name,
                    coverURL: spot.coverURL ?? '',
                    type: spot.type.toLowerCase(),
                    status: spot.status.toLowerCase(),
                    indoor: spot.indoor,
                    tags: spot.tags,
                    obstacles: spot.obstacles,
                    facebook: spot.facebook ?? undefined,
                    instagram: spot.instagram ?? undefined,
                    snapchat: spot.snapchat ?? undefined,
                    website: spot.website ?? undefined,
                    location: {
                        streetName: spot.streetName ?? '',
                        streetNumber: spot.streetNumber ?? '',
                        city: spot.city ?? '',
                        country: spot.country ?? '',
                    },
                    _geo: {
                        lat: spot.latitude,
                        lng: spot.longitude,
                    },
                },
            ], { primaryKey: 'objectID' })
            .catch((err) => {
                console.error('Failed to index spot in Meilisearch:', err);
            });

        return formatPrismaSpot(spot);
    });

export const getSpot = os.spots.getSpot.handler(async ({ context, input }) => {
    const spot = await context.prisma.spot.findUnique({
        where: { id: input.id },
        include: addedByInclude,
    });

    if (!spot) {
        throw new ORPCError('NOT_FOUND', { message: 'Spot not found' });
    }

    return formatPrismaSpot(spot);
});

export const getSpotOverview = os.spots.getSpotOverview.handler(async ({ context, input }) => {
    const now = new Date();

    const spot = await context.prisma.spot.findUnique({
        where: { id: input.id },
        include: addedByInclude,
    });

    if (!spot) {
        throw new ORPCError('NOT_FOUND', { message: 'Spot not found' });
    }

    const [mostLikedRaw, medias, clips] = await Promise.all([
        context.prisma.$queryRaw<PrismaMedia[]>`
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
        context.prisma.media.findMany({
            where: {
                spotId: input.id,
                createdAt: { lt: now },
                OR: [{ image: { not: { equals: null } } }, { video: { not: { equals: null } } }],
                AND: [{ OR: [{ releaseDate: null }, { releaseDate: { lt: now } }] }],
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                addedBy: { include: { user: { select: { username: true } } } },
                spot: { include: addedByInclude },
            },
        }),
        context.prisma.clip.findMany({
            where: { spotId: input.id, createdAt: { lt: now } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: addedByInclude,
        }),
    ]);

    const mostLikedMedia =
        mostLikedRaw.length > 0 ? formatPrismaMedia(mostLikedRaw[0] as unknown as MediaWithRelations) : undefined;

    return {
        spot: formatPrismaSpot(spot),
        medias: medias.map(formatPrismaMedia),
        clips: clips.map(formatPrismaClip),
        mostLikedMedia,
    };
});

export const getSpotsGeoJSON = os.spots.getSpotsGeoJSON.handler(async ({ context, input }) => {
    const spots = await context.prisma.spot.findMany({
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
});

export const listByTags = os.spots.listByTags.handler(async ({ context, input }) => {
    if (input.tagsFromMedia) {
        const medias = await context.prisma.media.findMany({
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

        const spots = await context.prisma.spot.findMany({
            where: { id: { in: spotIds } },
            include: addedByInclude,
        });

        return spots.map(formatPrismaSpot);
    }

    const spots = await context.prisma.spot.findMany({
        where: { tags: { hasSome: input.tags } },
        include: addedByInclude,
        take: input.limit,
    });

    return spots.map(formatPrismaSpot);
});

export const getVideoInfo = os.spots.getVideoInformation.handler(async ({ input }) => {
    const info = await getVideoInformation(input.url);
    return {
        title: info.title,
        description: info.description,
        thumbnailURL: info.thumbnailURL,
        provider: info.provider,
    };
});

export const addClipToSpot = os.spots.addClipToSpot
    .use(authed)
    .use(loadProfile)
    .use(loadSpot)
    .handler(async ({ context, input }) => {
        const { profile, spot } = context;

        // Fetch video metadata from YouTube/Vimeo (outside transaction — external call)
        const videoInfo = await getVideoInformation(input.videoURL);

        // Create the clip and recompute clipsStat atomically
        const clip = await context.prisma.$transaction(async (tx) => {
            const created = await tx.clip.create({
                data: {
                    title: videoInfo.title,
                    description: videoInfo.description,
                    provider: videoInfo.provider.toUpperCase() as ClipProvider,
                    videoURL: input.videoURL,
                    thumbnailURL: videoInfo.thumbnailURL,
                    spotId: spot.id,
                    addedById: profile.id,
                },
                include: addedByInclude,
            });

            // Recompute clipsStat on the spot (same approach as carrelage)
            const allClips = await tx.clip.findMany({
                where: { spotId: spot.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            });

            await tx.spot.update({
                where: { id: spot.id },
                data: { clipsStat: buildStat(allClips) },
            });

            return created;
        });

        return formatPrismaClip(clip);
    });
