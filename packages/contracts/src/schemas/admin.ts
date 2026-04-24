import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

export const RoleSchema = z.enum(['USER', 'MODERATOR', 'ADMIN']);
export const SubscriptionStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'NONE']);
export const StanceSchema = z.enum(['GOOFY', 'REGULAR']);

// ============================================================================
// List users (existing)
// ============================================================================

export const AdminUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    role: RoleSchema,
    banned: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const listUsersOutput = z.object({
    users: z.array(AdminUserSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

export const listUsersInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['username', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    role: RoleSchema.optional(),
    banned: z.boolean().optional(),
});

// ============================================================================
// Get user by username
// ============================================================================

// Admin-specific schemas matching the raw Postgres JSON shape.
// These differ from the shared CloudinaryFileSchema/StatSchema which expect
// formatted output (e.g. StatSchema requires `className` that only exists
// after formatStat() is applied, not in the raw DB JSON).

const AdminCloudinaryFileSchema = z.object({
    publicId: z.string().nullable(),
    version: z.string().nullable(),
    url: z.string(),
    format: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
});

const AdminStatSchema = z.object({
    all: z.number(),
    monthly: z.number(),
    weekly: z.number(),
    daily: z.number(),
    createdAt: z.coerce.date().nullable(),
});

export const AdminUserDetailSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.boolean(),
    name: z.string().nullable(),
    image: z.string().nullable(),
    role: RoleSchema,
    banned: z.boolean(),
    banReason: z.string().nullable(),
    banExpires: z.coerce.date().nullable(),
    receiveNewsletter: z.boolean(),
    welcomeMailSent: z.boolean(),
    subscriptionStatus: SubscriptionStatusSchema,
    stripeCustomerId: z.string().nullable(),
    subscriptionEndAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const AdminProfileSchema = z.object({
    id: z.string(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    stance: StanceSchema.nullable(),
    snapchat: z.string().nullable(),
    instagram: z.string().nullable(),
    website: z.string().nullable(),
    sponsors: z.array(z.string()),
    profilePicture: AdminCloudinaryFileSchema.nullable(),
    banner: AdminCloudinaryFileSchema.nullable(),
    followersStat: AdminStatSchema.nullable(),
    followingStat: AdminStatSchema.nullable(),
    spotsFollowingStat: AdminStatSchema.nullable(),
    mediasStat: AdminStatSchema.nullable(),
    clipsStat: AdminStatSchema.nullable(),
    tricksDoneStat: AdminStatSchema.nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const AdminAccountSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    hasAccessToken: z.boolean(),
    hasRefreshToken: z.boolean(),
    accessTokenExpiresAt: z.coerce.date().nullable(),
    refreshTokenExpiresAt: z.coerce.date().nullable(),
    scope: z.string().nullable(),
    hasIdToken: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const getUserByUsernameInput = z.object({
    username: z.string(),
});

export const getUserByUsernameOutput = z.object({
    user: AdminUserDetailSchema,
    profile: AdminProfileSchema.nullable(),
    accounts: z.array(AdminAccountSchema),
});

// ============================================================================
// Update user
// ============================================================================

export const updateUserInput = z.object({
    id: z.string(),
    username: z.string().min(1).optional(),
    displayUsername: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    name: z.string().nullable().optional(),
    role: RoleSchema.optional(),
});

export const updateUserOutput = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    name: z.string().nullable(),
    role: RoleSchema,
    updatedAt: z.coerce.date(),
});

// ============================================================================
// Overview stats
// ============================================================================

export const SpotTypeCountSchema = z.object({
    type: z.enum(['SHOP', 'STREET', 'PARK', 'DIY', 'PRIVATE']),
    count: z.number(),
});

export const MediaTypeCountSchema = z.object({
    type: z.enum(['IMAGE', 'VIDEO']),
    count: z.number(),
});

export const ClipProviderCountSchema = z.object({
    provider: z.enum(['YOUTUBE', 'VIMEO']),
    count: z.number(),
});

export const adminOverviewOutput = z.object({
    totalUsers: z.number(),
    totalSpots: z.number(),
    totalMedia: z.number(),
    totalClips: z.number(),
    spotsByType: z.array(SpotTypeCountSchema),
    mediaByType: z.array(MediaTypeCountSchema),
    clipsByProvider: z.array(ClipProviderCountSchema),
});

// ============================================================================
// List spots
// ============================================================================

export const AdminSpotTypeSchema = z.enum(['SHOP', 'STREET', 'PARK', 'DIY', 'PRIVATE']);
export const AdminSpotStatusSchema = z.enum(['ACTIVE', 'WIP', 'RIP']);

export const AdminSpotSchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    type: AdminSpotTypeSchema,
    status: AdminSpotStatusSchema,
    addedBy: z
        .object({
            username: z.string(),
        })
        .nullable(),
    mediasStat: AdminStatSchema.nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const adminListSpotsInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'mediasStat']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    type: z.array(AdminSpotTypeSchema).optional(),
    status: z.array(AdminSpotStatusSchema).optional(),
});

export const adminListSpotsOutput = z.object({
    spots: z.array(AdminSpotSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

// ============================================================================
// Update spot general info
// ============================================================================

export const updateSpotGeneralInfoInput = z.object({
    id: z.string(),
    name: z.string().min(1).optional(),
    type: AdminSpotTypeSchema.optional(),
    status: AdminSpotStatusSchema.optional(),
    indoor: z.boolean().optional(),
    description: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});

export const updateSpotGeneralInfoOutput = z.object({
    id: z.string(),
    name: z.string(),
    type: AdminSpotTypeSchema,
    status: AdminSpotStatusSchema,
    indoor: z.boolean(),
    description: z.string().nullable(),
    tags: z.array(z.string()),
    updatedAt: z.coerce.date(),
});

// ============================================================================
// List media
// ============================================================================

export const MediaTypeSchema = z.enum(['IMAGE', 'VIDEO']);

const AdminS3FileSchema = z
    .object({
        provider: z.literal('s3'),
        key: z.string(),
        width: z.number().nullable(),
        height: z.number().nullable(),
    })
    .nullable();

const AdminCloudinaryFileSchemaMedia = z
    .object({
        publicId: z.string().nullable(),
        url: z.string(),
        width: z.number().nullable(),
        height: z.number().nullable(),
    })
    .nullable();

const AdminMediaImageSchema = z.union([AdminS3FileSchema, AdminCloudinaryFileSchemaMedia]);

export const AdminMediaSchema = z.object({
    id: z.string(),
    type: MediaTypeSchema,
    caption: z.string().nullable(),
    image: AdminMediaImageSchema,
    spot: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
    addedBy: z
        .object({
            username: z.string(),
        })
        .nullable(),
    createdAt: z.coerce.date(),
});

export const adminListMediaInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    type: MediaTypeSchema.optional(),
});

export const adminListMediaOutput = z.object({
    media: z.array(AdminMediaSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

// ============================================================================
// List clips
// ============================================================================

export const VideoProviderAdminSchema = z.enum(['YOUTUBE', 'VIMEO']);

export const AdminClipSchema = z.object({
    id: z.string(),
    title: z.string(),
    provider: VideoProviderAdminSchema,
    videoURL: z.string(),
    thumbnailURL: z.string(),
    spot: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
    addedBy: z
        .object({
            username: z.string(),
        })
        .nullable(),
    createdAt: z.coerce.date(),
});

export const adminListClipsInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const adminListClipsOutput = z.object({
    clips: z.array(AdminClipSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

// ============================================================================
// List maps
// ============================================================================

export const AdminMapCategorySchema = z.enum([
    'maps',
    'video',
    'skater',
    'filmer',
    'photographer',
    'magazine',
    'skatepark',
    'shop',
    'years',
    'greatest',
    'members',
    'artist',
]);

export const AdminMapSchema = z.object({
    id: z.string(),
    name: z.string(),
    categories: z.array(z.string()),
    subtitle: z.string().nullable(),
    staging: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const adminListMapsInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    categories: z.array(AdminMapCategorySchema).optional(),
});

export const adminListMapsOutput = z.object({
    maps: z.array(AdminMapSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

// ============================================================================
// Create map
// ============================================================================

export const createMapInput = z.object({
    id: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
    name: z.string().min(1),
    subtitle: z.string().default(''),
    categories: z.array(AdminMapCategorySchema).min(1, 'At least one category is required'),
    edito: z.string().default(''),
    about: z.string().default(''),
    staging: z.boolean().default(false),
    videos: z.array(z.string()).default([]),
    soundtrack: z.array(z.string()).default([]),
});

// ============================================================================
// Upload map image
// ============================================================================

export const updateMapInput = z.object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    categories: z.array(AdminMapCategorySchema).min(1, 'At least one category is required').optional(),
    edito: z.string().optional(),
    about: z.string().optional(),
    staging: z.boolean().optional(),
    videos: z.array(z.string()).optional(),
    soundtrack: z.array(z.string()).optional(),
});

// ============================================================================
// Upload map image
// ============================================================================

export const uploadMapImageInput = z.object({
    id: z.string().min(1),
    file: z.file(),
});

export const uploadMapImageOutput = z.object({
    path: z.string(),
});

// ============================================================================
// Delete map
// ============================================================================

export const deleteMapInput = z.object({
    id: z.string().min(1),
});
