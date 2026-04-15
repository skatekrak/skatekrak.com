import { z } from 'zod';

import { CloudinaryFileSchema, StatSchema } from './shared';

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
// Get user by username (new)
// ============================================================================

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
    profilePicture: CloudinaryFileSchema.nullable(),
    banner: CloudinaryFileSchema.nullable(),
    followersStat: StatSchema.nullable(),
    followingStat: StatSchema.nullable(),
    spotsFollowingStat: StatSchema.nullable(),
    mediasStat: StatSchema.nullable(),
    clipsStat: StatSchema.nullable(),
    tricksDoneStat: StatSchema.nullable(),
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
