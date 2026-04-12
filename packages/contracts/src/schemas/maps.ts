import { z } from 'zod';

// ============================================================================
// Output schemas
// ============================================================================

export const MapSchema = z.object({
    id: z.string(),
    name: z.string(),
    categories: z.array(z.string()),
    subtitle: z.string().nullable(),
    edito: z.string().nullable(),
    about: z.string().nullable(),
    videos: z.array(z.string()),
    staging: z.boolean(),
    soundtrack: z.array(z.string()),
});

export const MapListItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    subtitle: z.string().nullable(),
    about: z.string().nullable(),
    edito: z.string().nullable(),
    categories: z.array(z.string()),
});

// ============================================================================
// Input schemas
// ============================================================================

export const fetchMapInput = z.object({
    id: z.string(),
});
