import { ORPCError } from '@orpc/server';

import type { Prisma, ClipProvider } from '@krak/prisma';

import { env } from '../../env';
import { reverseGeocode } from '../../helpers/geocoding';
import { extractHashtags, addHashtagIfNeeded } from '../../helpers/hashtags';
import { processMediaFile } from '../../helpers/media-upload';
import { spotIndex, mapIndex, buildMapDocument } from '../../helpers/meilisearch';
import { buildStat, recomputeMediasStat, type Stat } from '../../helpers/stats';
import { os, authed, admin } from '../base';
import { deleteSpotRecord } from './admin.delete-spot';
import { mergeSpotRecords } from './admin.merge';

// Types matching the raw Postgres JSON shapes for Prisma Json? columns.
// These mirror the Zod schemas in @krak/contracts (AdminCloudinaryFileSchema).

type AdminCloudinaryFile = {
    publicId: string | null;
    version: string | null;
    url: string;
    format: string | null;
    width: number | null;
    height: number | null;
};

type AdminCloudinaryFileMedia = {
    publicId: string | null;
    url: string;
    width: number | null;
    height: number | null;
} | null;

type PlacesAutocompleteResponse = {
    suggestions?: Array<{ placePrediction?: { placeId?: string; text?: { text?: string } } }>;
};

type PlaceDetailsResponse = {
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
};

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

        // Compute spots created stat live from the database
        let spotsCreatedStat: Stat | null = null;
        if (user.profile) {
            const spotsCreated = await context.prisma.spot.findMany({
                where: { addedById: user.profile.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
            });
            spotsCreatedStat = buildStat(spotsCreated);
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
                      profilePicture: user.profile.profilePicture as AdminCloudinaryFile | null,
                      banner: user.profile.banner as AdminCloudinaryFile | null,
                      followersStat: user.profile.followersStat as Stat | null,
                      followingStat: user.profile.followingStat as Stat | null,
                      spotsCreatedStat,
                      mediasStat: user.profile.mediasStat as Stat | null,
                      clipsStat: user.profile.clipsStat as Stat | null,
                      tricksDoneStat: user.profile.tricksDoneStat as Stat | null,
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
// admin.users.createProfile — Create a profile for a user that doesn't have one
// ============================================================================

export const createProfile = os.admin.users.createProfile
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const user = await context.prisma.user.findUnique({
            where: { id: input.userId },
            include: { profile: true },
        });

        if (!user) {
            throw new ORPCError('NOT_FOUND', { message: `User '${input.userId}' not found` });
        }

        if (user.profile) {
            throw new ORPCError('CONFLICT', { message: 'User already has a profile' });
        }

        const profile = await context.prisma.profile.create({
            data: { userId: user.id },
        });

        return {
            id: profile.id,
            description: profile.description,
            location: profile.location,
            stance: profile.stance,
            snapchat: profile.snapchat,
            instagram: profile.instagram,
            website: profile.website,
            sponsors: profile.sponsors,
            profilePicture: profile.profilePicture as AdminCloudinaryFile | null,
            banner: profile.banner as AdminCloudinaryFile | null,
            followersStat: profile.followersStat as Stat | null,
            followingStat: profile.followingStat as Stat | null,
            spotsCreatedStat: null,
            mediasStat: profile.mediasStat as Stat | null,
            clipsStat: profile.clipsStat as Stat | null,
            tricksDoneStat: profile.tricksDoneStat as Stat | null,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };
    });

// ============================================================================
// admin.users.update — Update core user fields (admin only)
// ============================================================================

export const updateUser = os.admin.users.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, ...fields } = input;

        // Verify user exists
        const existing = await context.prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `User '${id}' not found` });
        }

        // Uniqueness checks for fields that must be unique
        if (fields.username !== undefined && fields.username !== existing.username) {
            const taken = await context.prisma.user.findUnique({ where: { username: fields.username } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Username already taken' });
            }
        }

        if (
            fields.displayUsername !== undefined &&
            fields.displayUsername !== null &&
            fields.displayUsername !== existing.displayUsername
        ) {
            const taken = await context.prisma.user.findUnique({ where: { displayUsername: fields.displayUsername } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Display username already taken' });
            }
        }

        if (fields.email !== undefined && fields.email !== null && fields.email !== existing.email) {
            const taken = await context.prisma.user.findUnique({ where: { email: fields.email } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Email already taken' });
            }
        }

        // Build conditional update data
        const data: Prisma.UserUpdateInput = {};
        if (fields.username !== undefined) data.username = fields.username;
        if (fields.displayUsername !== undefined) data.displayUsername = fields.displayUsername;
        if (fields.email !== undefined) data.email = fields.email;
        if (fields.name !== undefined) data.name = fields.name;
        if (fields.role !== undefined) data.role = fields.role;

        const user = await context.prisma.user.update({
            where: { id },
            data,
        });

        return {
            id: user.id,
            username: user.username,
            displayUsername: user.displayUsername,
            email: user.email,
            name: user.name,
            role: user.role,
            updatedAt: user.updatedAt,
        };
    });

// ============================================================================
// admin.overview — Aggregate platform counts
// ============================================================================

export const overview = os.admin.overview
    .use(authed)
    .use(admin)
    .handler(async ({ context }) => {
        const [totalUsers, totalSpots, totalMedia, totalClips, spotsByTypeRaw, mediaByTypeRaw, clipsByProviderRaw] =
            await Promise.all([
                context.prisma.user.count(),
                context.prisma.spot.count(),
                context.prisma.media.count(),
                context.prisma.clip.count(),
                context.prisma.spot.groupBy({
                    by: ['type'],
                    _count: { type: true },
                }),
                context.prisma.media.groupBy({
                    by: ['type'],
                    _count: { type: true },
                }),
                context.prisma.clip.groupBy({
                    by: ['provider'],
                    _count: { provider: true },
                }),
            ]);

        const spotsByType = spotsByTypeRaw.map((row) => ({
            type: row.type,
            // oxlint-disable-next-line no-underscore-dangle
            count: row._count.type,
        }));

        const mediaByType = mediaByTypeRaw.map((row) => ({
            type: row.type,
            // oxlint-disable-next-line no-underscore-dangle
            count: row._count.type,
        }));

        const clipsByProvider = clipsByProviderRaw.map((row) => ({
            provider: row.provider,
            // oxlint-disable-next-line no-underscore-dangle
            count: row._count.provider,
        }));

        return { totalUsers, totalSpots, totalMedia, totalClips, spotsByType, mediaByType, clipsByProvider };
    });

// ============================================================================
// admin.spots.list — Paginated, sortable spot listing for admin dashboard
// ============================================================================

export const listSpots = os.admin.spots.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search, type, status, tags } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.SpotWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type && type.length > 0) {
            where.type = { in: type };
        }

        if (status && status.length > 0) {
            where.status = { in: status };
        }

        if (tags && tags.length > 0) {
            where.tags = { hasEvery: tags };
        }

        const orderBy = sortBy === 'mediasStat' ? { medias: { _count: sortOrder } } : { [sortBy]: sortOrder };

        const [spots, total] = await Promise.all([
            context.prisma.spot.findMany({
                where,
                orderBy,
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
                    mediasStat: true,
                    createdAt: true,
                    updatedAt: true,
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
                mediasStat: spot.mediasStat as Stat | null,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
            })),
            total,
            page,
            perPage,
        };
    });

// ============================================================================
// admin.spots.updateGeneralInfo — Update spot general info fields
// ============================================================================

export const updateSpotGeneralInfo = os.admin.spots.updateGeneralInfo
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, ...fields } = input;

        // Build the Prisma update data, only including fields that were provided
        const data: Prisma.SpotUpdateInput = {};

        if (fields.name !== undefined) data.name = fields.name;
        if (fields.type !== undefined) data.type = fields.type;
        if (fields.status !== undefined) data.status = fields.status;
        if (fields.indoor !== undefined) data.indoor = fields.indoor;
        if (fields.description !== undefined) data.description = fields.description;
        if (fields.tags !== undefined) data.tags = fields.tags;

        const spot = await context.prisma.spot.update({
            where: { id },
            data,
        });

        return {
            id: spot.id,
            name: spot.name,
            type: spot.type,
            status: spot.status,
            indoor: spot.indoor,
            description: spot.description,
            tags: spot.tags,
            updatedAt: spot.updatedAt,
        };
    });

export const updateSpotLocation = os.admin.spots.updateLocation
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const location = await reverseGeocode(input.latitude, input.longitude, env.GOOGLE_KEY);
        const spot = await context.prisma.spot.update({
            where: { id: input.id },
            data: {
                latitude: input.latitude,
                longitude: input.longitude,
                streetNumber: location?.streetNumber ?? null,
                streetName: location?.streetName ?? null,
                city: location?.city ?? null,
                country: location?.country ?? null,
            },
        });

        return { id: spot.id, latitude: spot.latitude, longitude: spot.longitude };
    });

export const searchSpotAddresses = os.admin.spots.searchAddresses
    .use(authed)
    .use(admin)
    .handler(async ({ input }) => {
        const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': env.GOOGLE_KEY,
                'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text',
            },
            body: JSON.stringify({ input: input.query, sessionToken: input.sessionToken }),
        });

        if (!response.ok) {
            console.error('Google Places autocomplete failed:', response.status, await response.text());
            throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Address search failed' });
        }

        const data = (await response.json()) as PlacesAutocompleteResponse;
        return (data.suggestions ?? []).flatMap(({ placePrediction }) =>
            placePrediction?.placeId && placePrediction.text?.text
                ? [{ id: placePrediction.placeId, label: placePrediction.text.text }]
                : [],
        );
    });

export const resolveSpotAddress = os.admin.spots.resolveAddress
    .use(authed)
    .use(admin)
    .handler(async ({ input }) => {
        const params = new URLSearchParams({ sessionToken: input.sessionToken });
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${encodeURIComponent(input.placeId)}?${params}`,
            {
                headers: {
                    'X-Goog-Api-Key': env.GOOGLE_KEY,
                    'X-Goog-FieldMask': 'formattedAddress,location',
                },
            },
        );

        if (!response.ok) {
            console.error('Google Places details failed:', response.status, await response.text());
            throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Address lookup failed' });
        }

        const place = (await response.json()) as PlaceDetailsResponse;
        if (
            !place.formattedAddress ||
            place.location?.latitude === undefined ||
            place.location.longitude === undefined
        ) {
            throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Google returned an incomplete address' });
        }

        return {
            address: place.formattedAddress,
            latitude: place.location.latitude,
            longitude: place.location.longitude,
        };
    });

// ============================================================================
// admin.spots.merge — Move all source spot relations into target, then delete source
// ============================================================================

export const mergeSpots = os.admin.spots.merge
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { sourceSpotId, targetSpotId } = input;

        if (sourceSpotId === targetSpotId) {
            throw new ORPCError('BAD_REQUEST', { message: 'Source and target spots must be different' });
        }

        await context.prisma.$transaction((tx) => mergeSpotRecords(tx, { sourceSpotId, targetSpotId }));

        spotIndex.deleteDocument(sourceSpotId).catch((err) => {
            console.error('Failed to delete merged spot from Meilisearch:', err);
        });

        return { success: true, sourceSpotId, targetSpotId };
    });

// ============================================================================
// admin.spots.delete — Delete a spot and let relation onDelete rules clean up
// ============================================================================

export const deleteSpot = os.admin.spots.delete
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        await context.prisma.$transaction((tx) => deleteSpotRecord(tx, { spotId: input.id }));

        spotIndex.deleteDocument(input.id).catch((err) => {
            console.error('Failed to delete spot from Meilisearch:', err);
        });

        return { success: true };
    });

// ============================================================================
// admin.media.list — Paginated, sortable media listing for admin dashboard
// ============================================================================

export const listMedia = os.admin.media.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, type, releaseStatus, spotId, hashtags } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.MediaWhereInput = {};

        if (spotId) {
            where.spotId = spotId;
        }

        if (type) {
            where.type = type;
        }

        if (releaseStatus === 'planned') {
            where.releaseDate = { gt: new Date() };
        } else if (releaseStatus === 'released') {
            where.OR = [{ releaseDate: null }, { releaseDate: { lte: new Date() } }];
        }

        if (hashtags && hashtags.length > 0) {
            where.hashtags = { hasEvery: hashtags.map(addHashtagIfNeeded) };
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
                    releaseDate: true,
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
                image: m.image as AdminCloudinaryFileMedia,
                releaseDate: m.releaseDate,
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
// admin.media.update — Update media fields (caption, releaseDate, spotId)
// ============================================================================

export const updateMedia = os.admin.media.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, ...fields } = input;

        const existing = await context.prisma.media.findUnique({ where: { id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `Media ${id} not found` });
        }

        const data: Prisma.MediaUpdateInput = {};

        if (fields.caption !== undefined) {
            data.caption = fields.caption;
            data.hashtags = extractHashtags(fields.caption);
        }
        if (fields.releaseDate !== undefined) data.releaseDate = fields.releaseDate;
        if (fields.spotId !== undefined) {
            data.spot = fields.spotId ? { connect: { id: fields.spotId } } : { disconnect: true };
        }

        const media = await context.prisma.media.update({
            where: { id },
            data,
        });

        return {
            id: media.id,
            caption: media.caption,
            releaseDate: media.releaseDate,
            spotId: media.spotId,
            updatedAt: media.updatedAt,
        };
    });

// ============================================================================
// admin.media.create — Upload and create a new media entry (admin only)
// ============================================================================

export const createMedia = os.admin.media.create
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        // Resolve the admin's profile (required for addedById)
        const profile = await context.prisma.profile.findUnique({
            where: { userId: context.session.user.id },
        });
        if (!profile) {
            throw new ORPCError('BAD_REQUEST', { message: 'Admin profile not found. Create a profile first.' });
        }

        // Validate spot if provided
        if (input.spotId) {
            const spot = await context.prisma.spot.findUnique({ where: { id: input.spotId } });
            if (!spot) {
                throw new ORPCError('NOT_FOUND', { message: `Spot "${input.spotId}" not found` });
            }
        }

        // Process and upload the file
        const { mediaId, mediaType, imageField, videoField } = await processMediaFile(input.file).catch((err) => {
            throw new ORPCError('BAD_REQUEST', { message: err instanceof Error ? err.message : 'Upload failed' });
        });

        const hashtags = extractHashtags(input.caption);

        const media = await context.prisma.$transaction(async (tx) => {
            const created = await tx.media.create({
                data: {
                    ...(mediaId != null ? { id: mediaId } : {}),
                    type: mediaType,
                    caption: input.caption,
                    image: imageField,
                    video: videoField ?? undefined,
                    hashtags,
                    spotId: input.spotId ?? null,
                    addedById: profile.id,
                    releaseDate: input.releaseDate ?? null,
                },
                select: {
                    id: true,
                    type: true,
                    caption: true,
                    image: true,
                    releaseDate: true,
                    spot: { select: { id: true, name: true } },
                    addedBy: { select: { user: { select: { username: true } } } },
                    createdAt: true,
                },
            });

            await recomputeMediasStat(tx, { spotId: input.spotId, profileId: profile.id });

            return created;
        });

        return {
            id: media.id,
            type: media.type,
            caption: media.caption,
            image: media.image as AdminCloudinaryFileMedia,
            releaseDate: media.releaseDate,
            spot: media.spot ? { id: media.spot.id, name: media.spot.name } : null,
            addedBy: media.addedBy ? { username: media.addedBy.user.username } : null,
            createdAt: media.createdAt,
        };
    });

// ============================================================================
// admin.media.delete — Delete a media entry (admin only)
// ============================================================================

export const deleteMedia = os.admin.media.delete
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const existing = await context.prisma.media.findUnique({ where: { id: input.id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `Media "${input.id}" not found` });
        }

        await context.prisma.$transaction(async (tx) => {
            await tx.media.delete({ where: { id: input.id } });

            await recomputeMediasStat(tx, { spotId: existing.spotId, profileId: existing.addedById });
        });

        return { success: true };
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

// ============================================================================
// admin.maps.list — Paginated, sortable map listing for admin dashboard
// ============================================================================

export const listAdminMaps = os.admin.maps.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search, categories } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.MapWhereInput = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        if (categories && categories.length > 0) {
            where.categories = { hasSome: categories };
        }

        const [maps, total] = await Promise.all([
            context.prisma.map.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    name: true,
                    categories: true,
                    subtitle: true,
                    staging: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            context.prisma.map.count({ where }),
        ]);

        return {
            maps,
            total,
            page,
            perPage,
        };
    });

// ============================================================================
// admin.maps.create — Create a new map
// ============================================================================

export const createAdminMap = os.admin.maps.create
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, name, subtitle, categories, edito, about, staging, videos, soundtrack } = input;

        const existing = await context.prisma.map.findUnique({ where: { id } });
        if (existing) {
            throw new ORPCError('CONFLICT', { message: `A map with ID "${id}" already exists` });
        }

        const map = await context.prisma.map.create({
            data: {
                id,
                name,
                subtitle,
                categories,
                edito,
                about,
                staging,
                videos,
                soundtrack,
            },
        });

        // Index the new map in Meilisearch (fire-and-forget, don't block the response)
        mapIndex.addDocuments([buildMapDocument(map)], { primaryKey: 'id' }).catch((err) => {
            console.error('Failed to index map in Meilisearch:', err);
        });

        return map;
    });

// ============================================================================
// admin.maps.update — Update an existing map
// ============================================================================

export const updateAdminMap = os.admin.maps.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, ...data } = input;

        const existing = await context.prisma.map.findUnique({ where: { id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `Map "${id}" not found` });
        }

        const map = await context.prisma.map.update({
            where: { id },
            data,
        });

        // Keep the Meilisearch document in sync (fire-and-forget)
        mapIndex.addDocuments([buildMapDocument(map)], { primaryKey: 'id' }).catch((err) => {
            console.error('Failed to update map in Meilisearch:', err);
        });

        return map;
    });

// ============================================================================
// admin.maps.uploadImage — Upload a map image (convert to PNG, store in S3)
// ============================================================================

export const uploadMapImage = os.admin.maps.uploadImage
    .use(authed)
    .use(admin)
    .handler(async ({ input }) => {
        const { default: sharp } = await import('sharp');
        const { uploadToS3 } = await import('../../helpers/s3');

        const file = input.file;
        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert to PNG using sharp
        const pngBuffer = await sharp(buffer).rotate().png().toBuffer();

        const key = `assets/maps/custom-maps/${input.id}.png`;
        await uploadToS3(key, pngBuffer, 'image/png');

        return { path: key };
    });

// ============================================================================
// admin.maps.delete — Delete a map
// ============================================================================

export const deleteAdminMap = os.admin.maps.delete
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const existing = await context.prisma.map.findUnique({ where: { id: input.id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `Map "${input.id}" not found` });
        }

        await context.prisma.map.delete({ where: { id: input.id } });

        // Remove the Meilisearch document (fire-and-forget)
        mapIndex.deleteDocument(input.id).catch((err) => {
            console.error('Failed to delete map from Meilisearch:', err);
        });

        return { success: true };
    });
