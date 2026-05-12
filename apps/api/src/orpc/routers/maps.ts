import { ORPCError } from '@orpc/server';

import { mapCategoryLabels } from '@krak/contracts';

import { os } from '../base';

// ============================================================================
// Category mapping
// ============================================================================

function mapCategoryKeysToLabels(categories: string[]): string[] {
    return categories.map((category) => mapCategoryLabels[category as keyof typeof mapCategoryLabels] ?? category);
}

// ============================================================================
// Procedure implementations
// ============================================================================

export const fetchMap = os.maps.fetch.handler(async ({ context, input }) => {
    const map = await context.prisma.map.findUnique({
        where: { id: input.id },
    });

    if (map == null) {
        throw new ORPCError('NOT_FOUND', { message: "This map doesn't exists" });
    }

    if (process.env.NODE_ENV !== 'production' && map.staging) {
        throw new ORPCError('NOT_FOUND', { message: "This map doesn't exists" });
    }

    return {
        id: map.id,
        name: map.name,
        categories: mapCategoryKeysToLabels(map.categories),
        subtitle: map.subtitle,
        edito: map.edito,
        about: map.about,
        videos: map.videos,
        staging: false,
        soundtrack: map.soundtrack,
    };
});

export const listMaps = os.maps.list.handler(async ({ context }) => {
    const where = process.env.NODE_ENV !== 'production' ? { staging: false } : {};

    const maps = await context.prisma.map.findMany({ where });

    return maps.map((map) => ({
        id: map.id,
        name: map.name,
        subtitle: map.subtitle,
        about: map.about,
        edito: map.edito,
        categories: mapCategoryKeysToLabels(map.categories),
    }));
});
