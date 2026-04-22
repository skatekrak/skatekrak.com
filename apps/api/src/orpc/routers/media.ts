import { ORPCError } from '@orpc/server';
import { createId } from '@paralleldrive/cuid2';

import type { MediaType } from '@krak/prisma';

import { uploadToCloudinary } from '../../helpers/cloudinary';
import { uploadToS3 } from '../../helpers/s3';
import { buildStat } from '../../helpers/stats';
import { os, authed, loadProfile, loadSpot } from '../base';
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
                ...(input.hashtag ? [{ hashtags: { has: addHashtagIfNeeded(input.hashtag) } }] : []),
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
    const hashtag = addHashtagIfNeeded(input.hashtag);
    const [prevMedias, nextMedias] = await Promise.all([
        context.prisma.media.findMany({
            where: {
                hashtags: { has: hashtag },
                createdAt: { gt: input.mediaCreatedAt },
            },
            orderBy: { createdAt: 'asc' },
            take: 1,
            include: mediaInclude,
        }),
        context.prisma.media.findMany({
            where: {
                hashtags: { has: hashtag },
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

// ============================================================================
// Helpers
// ============================================================================

/** Extract hashtags from a caption string (port of carrelage's extractHashtags) */
function extractHashtags(str: string | undefined): string[] {
    if (!str) return [];
    const result = str.match(/#[\w\d]+/g);
    return result ? [...new Set(result)] : [];
}

/** Ensure a hashtag string starts with '#' (stored hashtags include the prefix) */
function addHashtagIfNeeded(tag: string): string {
    return tag[0] !== '#' ? `#${tag}` : tag;
}

// ============================================================================
// Mutations
// ============================================================================

/** Upload a media file to a spot (single-step: upload to Cloudinary + create DB record + recompute stats) */
export const uploadToSpot = os.media.uploadToSpot
    .use(authed)
    .use(loadProfile)
    .use(loadSpot)
    .handler(async ({ context, input }) => {
        const { profile, spot } = context;

        // 1. Read the file and determine its type
        const file = input.file;
        const mimeType = file.type || 'application/octet-stream';
        const resourceType = mimeType.split('/')[0] as string;

        if (resourceType !== 'image' && resourceType !== 'video') {
            throw new ORPCError('BAD_REQUEST', { message: `Unsupported file type: ${mimeType}` });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const isVideo = resourceType === 'video';
        const mediaType: MediaType = isVideo ? 'VIDEO' : 'IMAGE';

        let imageField: Record<string, unknown>;
        let videoField: Record<string, unknown> | undefined;
        let mediaId: string | undefined;

        if (isVideo) {
            // Videos stay on Cloudinary
            const cloudinaryFile = await uploadToCloudinary(buffer, mimeType, 'medias');
            imageField = { publicId: cloudinaryFile.publicId, url: cloudinaryFile.url.replace('.mp4', '.webp') };
            videoField = cloudinaryFile;
        } else {
            // Images go to S3 via sharp
            const { default: sharp } = await import('sharp');
            const webpBuffer = await sharp(buffer).webp().toBuffer();
            const metadata = await sharp(buffer).metadata();
            const width = metadata.width ?? 0;
            const height = metadata.height ?? 0;

            mediaId = createId();
            const s3Key = `assets/medias/${mediaId}.webp`;
            await uploadToS3(s3Key, webpBuffer, 'image/webp');

            imageField = { provider: 's3', key: s3Key, width, height };
        }

        // 3. Extract hashtags from caption
        const hashtags = extractHashtags(input.caption);

        // 4. Create the media record and recompute stats atomically
        const media = await context.prisma.$transaction(async (tx) => {
            const created = await tx.media.create({
                data: {
                    ...(mediaId != null ? { id: mediaId } : {}),
                    type: mediaType,
                    caption: input.caption,
                    image: imageField,
                    video: videoField ?? undefined,
                    hashtags,
                    spotId: spot.id,
                    addedById: profile.id,
                },
                include: mediaInclude,
            });

            // Recompute mediasStat on the spot
            const allSpotMedias = await tx.media.findMany({
                where: { spotId: spot.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            });

            await tx.spot.update({
                where: { id: spot.id },
                data: { mediasStat: buildStat(allSpotMedias) },
            });

            // Recompute mediasStat on the profile
            const allProfileMedias = await tx.media.findMany({
                where: { addedById: profile.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            });

            await tx.profile.update({
                where: { id: profile.id },
                data: { mediasStat: buildStat(allProfileMedias) },
            });

            return created;
        });

        return formatPrismaMedia(media);
    });
