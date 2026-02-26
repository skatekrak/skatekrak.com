import { z } from 'zod';
import { Types, Status, VideoProvider } from '@krak/carrelage-client';

// ============================================================================
// Enums (using nativeEnum to match carrelage-client types exactly)
// ============================================================================

export const SpotTypeSchema = z.nativeEnum(Types);

export const SpotStatusSchema = z.nativeEnum(Status);

export const VideoProviderSchema = z.nativeEnum(VideoProvider);

// ============================================================================
// Shared object schemas
// ============================================================================

export const StatSchema = z.object({
    createdAt: z.coerce.date(),
    className: z.string(),
    all: z.number(),
    monthly: z.number(),
    weekly: z.number(),
    daily: z.number(),
});

export const LocationSchema = z.object({
    streetName: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    country: z.string(),
    longitude: z.number(),
    latitude: z.number(),
});

export const CloudinaryFileSchema = z.object({
    publicId: z.string(),
    version: z.string(),
    url: z.string(),
    format: z.string(),
    width: z.number(),
    height: z.number(),
    jpg: z.string(),
});

export const AddedBySchema = z.object({
    username: z.string(),
    id: z.string(),
    profilePicture: z
        .object({
            url: z.string(),
            publicId: z.string(),
            jpg: z.string(),
        })
        .optional(),
});

export const ProfileSummarySchema = z.object({
    id: z.string(),
    username: z.string(),
    profilePicture: z.any(),
});
