import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

export const RoleSchema = z.enum(['USER', 'MODERATOR', 'ADMIN']);

// ============================================================================
// Output schemas
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

// ============================================================================
// Input schemas
// ============================================================================

export const listUsersInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['username', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    role: RoleSchema.optional(),
    banned: z.boolean().optional(),
});
