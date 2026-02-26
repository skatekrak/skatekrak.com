import { z } from 'zod';

// ============================================================================
// Output schemas
// ============================================================================

export const ProfileMeSchema = z.object({
    id: z.string(),
    username: z.string(),
    profilePicture: z
        .object({
            publicId: z.string(),
            version: z.string(),
            url: z.string(),
            format: z.string(),
            width: z.number(),
            height: z.number(),
            jpg: z.string(),
        })
        .nullable(),
});
