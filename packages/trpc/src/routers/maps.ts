import { z } from 'zod';
import { promises as fs } from 'fs';

import { publicProcedure, router, t } from '../trpc';
import { TRPCError } from '@trpc/server';
import '@krak/api/src/data/customMaps/_spots.json';

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
        const file = await fs.readFile(process.cwd() + '/src/data/customMaps/_spots.json', 'utf8');
        let customMaps: CustomMap[] = JSON.parse(file);

        loadedMaps = customMaps
            .filter((map) => {
                if (process.env.NODE_ENV !== 'production') {
                    return !map.staging;
                }
                return true;
            })
            .map((map): CustomMap => {
                return {
                    ...map,
                    edito: map.edito || '',
                    videos: map.videos || [],
                    categories: map.categories.map(
                        (category) => CustomMapCategory[category as unknown as keyof typeof CustomMapCategory],
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
