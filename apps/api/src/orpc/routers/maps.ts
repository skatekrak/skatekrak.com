import { ORPCError } from '@orpc/server';

import { os } from '../base';

// ============================================================================
// Category mapping
// ============================================================================

enum CustomMapCategory {
    maps = 'Maps',
    video = 'Video',
    skater = 'Skaters',
    filmer = 'Filmers',
    photographer = 'Photographers',
    magazine = 'Magazines',
    skatepark = 'Skateparks',
    shop = 'Shops',
    years = 'Years',
    greatest = 'Greatest',
    members = 'Members',
    artist = 'Artists',
}

function mapCategories(categories: string[]): string[] {
    return categories.map((category) => CustomMapCategory[category as keyof typeof CustomMapCategory] ?? category);
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
        categories: mapCategories(map.categories),
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
        categories: mapCategories(map.categories),
    }));
});
