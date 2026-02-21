import { z } from 'zod';

import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

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
    return categories.map(
        (category) => CustomMapCategory[category as keyof typeof CustomMapCategory] ?? category,
    );
}

export const mapsRouter = router({
    fetch: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const map = await ctx.prisma.map.findUnique({
            where: { id: input.id },
        });

        if (map == null) {
            throw new TRPCError({ code: 'NOT_FOUND', message: "This map doesn't exists" });
        }

        // Filter staging maps in non-production
        if (process.env.NODE_ENV !== 'production' && map.staging) {
            throw new TRPCError({ code: 'NOT_FOUND', message: "This map doesn't exists" });
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
    }),

    list: publicProcedure.query(async ({ ctx }) => {
        const where = process.env.NODE_ENV !== 'production' ? { staging: false } : {};

        const maps = await ctx.prisma.map.findMany({ where });

        return maps.map((map) => ({
            id: map.id,
            name: map.name,
            subtitle: map.subtitle,
            about: map.about,
            edito: map.edito,
            categories: mapCategories(map.categories),
        }));
    }),
});
