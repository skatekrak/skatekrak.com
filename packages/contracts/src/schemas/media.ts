import { z } from 'zod';

import { AddedBySchema, CloudinaryFileSchema, VideoProviderSchema } from './shared';
import { SpotSchema } from './spots';

// ============================================================================
// Output schemas
// ============================================================================

export const MediaSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    type: z.enum(['image', 'video']),
    caption: z.string().optional(),
    image: CloudinaryFileSchema.nullish(),
    video: CloudinaryFileSchema.nullish(),
    addedBy: AddedBySchema,
    spot: SpotSchema.optional(),
});

export const ClipSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    title: z.string(),
    provider: VideoProviderSchema,
    videoURL: z.string(),
    thumbnailURL: z.string(),
    spot: z.string(),
    addedBy: AddedBySchema,
});

export const MediasAroundSchema = z.object({
    prevMedia: MediaSchema.optional(),
    nextMedia: MediaSchema.optional(),
});

// ============================================================================
// Input schemas
// ============================================================================

export const getMediaByIdInput = z.object({
    id: z.string(),
});

export const listBySpotInput = z.object({
    spotId: z.string(),
    cursor: z.date().optional(),
    limit: z.number().min(1).max(100).default(20),
});

export const getSpotMediasAroundInput = z.object({
    spotId: z.string(),
    mediaCreatedAt: z.date(),
});

export const listMediaInput = z.object({
    hashtag: z.string().optional(),
    cursor: z.date().optional(),
    limit: z.number().min(1).max(100).default(20),
});

export const getHashtagMediasAroundInput = z.object({
    hashtag: z.string(),
    mediaCreatedAt: z.date(),
});

export const listClipsBySpotInput = z.object({
    spotId: z.string(),
    cursor: z.date().optional(),
    limit: z.number().min(1).max(100).default(20),
});
