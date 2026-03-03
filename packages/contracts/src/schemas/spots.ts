import { z } from 'zod';

import {
    StatSchema,
    LocationSchema,
    ProfileSummarySchema,
    SpotTypeSchema,
    SpotStatusSchema,
    ObstacleSchema,
    VideoProviderSchema,
} from './shared';

// ============================================================================
// Output schemas
// ============================================================================

export const SpotSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    className: z.string(),
    name: z.string(),
    location: LocationSchema,
    geo: z.tuple([z.number(), z.number()]),
    geoHash: z.string(),
    type: SpotTypeSchema,
    status: SpotStatusSchema,
    description: z.string(),
    indoor: z.boolean(),
    openingHours: z.array(z.string()),
    phone: z.string(),
    website: z.string(),
    instagram: z.string(),
    snapchat: z.string(),
    facebook: z.string(),
    addedBy: ProfileSummarySchema,
    coverURL: z.string(),
    commentsStat: StatSchema,
    comments: z.array(z.any()),
    mediasStat: StatSchema,
    clipsStat: StatSchema,
    tricksDoneStat: StatSchema,
    tags: z.array(z.string()),
});

export const SpotGeoJSONSchema = z.object({
    type: z.literal('Feature'),
    geometry: z.object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
    }),
    properties: z.object({
        id: z.string(),
        name: z.string(),
        type: z.union([SpotTypeSchema, SpotStatusSchema]),
        indoor: z.boolean(),
        tags: z.array(z.string()),
        mediasStat: StatSchema,
    }),
});

// ============================================================================
// Input schemas
// ============================================================================

export const getSpotInput = z.object({
    id: z.string(),
});

export const getSpotOverviewInput = z.object({
    id: z.string(),
});

export const getSpotsGeoJSONInput = z.object({
    northEast: z.object({ latitude: z.number(), longitude: z.number() }),
    southWest: z.object({ latitude: z.number(), longitude: z.number() }),
});

export const listByTagsInput = z.object({
    tags: z.array(z.string()).min(1, 'You must give at least one tag'),
    tagsFromMedia: z.boolean().default(false),
    limit: z.number().default(2000),
});

export const createSpotInput = z.object({
    name: z.string().min(1),
    latitude: z.number(),
    longitude: z.number(),
    type: SpotTypeSchema,
    indoor: z.boolean(),
    status: SpotStatusSchema.optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    instagram: z.string().optional(),
    snapchat: z.string().optional(),
    facebook: z.string().optional(),
    tags: z.array(z.string()).optional(),
    obstacles: z.array(ObstacleSchema).optional(),
});

export const reverseGeocodeInput = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export const ReverseGeocodeResultSchema = z.object({
    streetNumber: z.string().nullable(),
    streetName: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
});

export const getVideoInformationInput = z.object({
    url: z.string().url(),
});

export const VideoInformationSchema = z.object({
    title: z.string(),
    description: z.string(),
    thumbnailURL: z.string(),
    provider: VideoProviderSchema,
});
