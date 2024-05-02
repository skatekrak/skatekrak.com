import { z } from 'zod';
import path from 'path';

import { publicProcedure, router, t } from '../trpc';
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

const loadMaps = t.middleware(async (opts) => {
    const directory = path.join(process.cwd(), 'src', 'data', 'customMaps');
    let customMaps: CustomMap[] = await Bun.file(directory + '/_spots.json').json();

    customMaps = customMaps.filter((map) => {
        if (process.env.NODE_ENV !== 'production') {
            return !map.staging;
        }
        return true;
    });

    return opts.next({
        ctx: {
            customMaps,
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
