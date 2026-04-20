import { z } from 'zod';

import { AdminMapCategorySchema } from '@krak/contracts';

import type { UseFormReturn } from 'react-hook-form';

export const createMapSchema = z.object({
    id: z
        .string()
        .min(1, 'ID is required')
        .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
    name: z.string().min(1, 'Name is required'),
    subtitle: z.string(),
    categories: z.array(AdminMapCategorySchema).min(1, 'At least one category is required'),
    edito: z.string(),
    about: z.string(),
    staging: z.boolean(),
    videos: z.array(z.object({ value: z.string() })),
    soundtrack: z.array(z.object({ value: z.string() })),
});

export type CreateMapValues = z.infer<typeof createMapSchema>;

export type CreateMapFormControl = UseFormReturn<CreateMapValues>['control'];
