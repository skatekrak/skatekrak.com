import { z } from 'zod';

import { publicProcedure, router, t } from '../trpc';
import { TRPCError } from '@trpc/server';
import CustomMaps from '@krak/api/src/data/customMaps/_spots.json';

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
}

interface CustomMap {
    id: string;
    name: string;
    categories: CustomMapCategory[];
    subtitle: string;
    edito: string;
    about: string;
    videos: string[];
    staging: boolean;
}

let loadedMaps: CustomMap[] = [];

const loadMaps = t.middleware(async (opts) => {
    if (loadedMaps.length <= 0) {
        loadedMaps = CustomMaps.filter((map) => {
            if (process.env.NODE_ENV !== 'production') {
                return !map.staging;
            }
            return true;
        }).map((map): CustomMap => {
            return {
                ...map,
                edito: map.edito || '',
                videos: map.videos || [],
                categories: map.categories.map(
                    (category) => CustomMapCategory[category as keyof typeof CustomMapCategory],
                ),
                staging: false,
            };
        });
    }

    return opts.next({
        ctx: {
            customMaps: loadedMaps,
        },
    });
});

export const mapsRouter = router({
    fetch: publicProcedure
        .input(z.object({ id: z.string() }))
        .use(loadMaps)
        .query(async ({ ctx, input }) => {
            const map = ctx.customMaps.find((map) => map.id === input.id);
            if (map == null) {
                throw new TRPCError({ code: 'NOT_FOUND', message: "This map doesn't exists" });
            }
            return map;
        }),

    list: publicProcedure.use(loadMaps).query(async ({ ctx }) => {
        return ctx.customMaps.map((map) => ({
            id: map.id,
            name: map.name,
            subtitle: map.subtitle,
            about: map.about,
            edito: map.edito,
            categories: map.categories,
        }));
    }),
});
