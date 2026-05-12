import { z } from 'zod';

import { AdminMapCategorySchema, mapCategories, mapCategoryLabels, type MapCategory } from '@krak/contracts';

import type { UseFormReturn } from 'react-hook-form';

// ============================================================================
// Form schema — shared between create and edit
// ============================================================================

export const mapFormSchema = z.object({
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

export type MapFormValues = z.infer<typeof mapFormSchema>;

export type MapFormControl = UseFormReturn<MapFormValues>['control'];

// ============================================================================
// Constants — re-exported from @krak/contracts
// ============================================================================

export { mapCategories, mapCategoryLabels, mapCategoryLabels as categoryLabels, type MapCategory };

/** Reverse lookup: display label → raw key (e.g. "Maps" → "maps") */
const categoryLabelToKey: Record<string, MapCategory> = Object.fromEntries(
    Object.entries(mapCategoryLabels).map(([key, label]) => [label, key as MapCategory]),
) as Record<string, MapCategory>;

/**
 * Convert category strings from the API (which may be display labels like "Maps")
 * back to raw enum keys ("maps"). Passes through values that are already raw keys.
 */
export function normalizeCategoryKeys(categories: string[]): MapCategory[] {
    return categories
        .map((cat) => (categoryLabelToKey[cat] ?? cat) as MapCategory)
        .filter((cat) => mapCategories.includes(cat));
}
