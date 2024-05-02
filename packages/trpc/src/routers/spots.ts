import { ObjectId } from 'mongodb';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { SpotGeoJSON, Spot } from '@krak/carrelage-client';

function formatSpotsToGEOJson(spots: Spot[]) {
    return spots.map(
        (spot): SpotGeoJSON => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: spot.geo,
            },
            properties: {
                id: spot.id,
                name: spot.name,
                type: spot.type,
                status: spot.status,
                indoor: spot.indoor,
                tags: spot.tags,
                mediasStat: spot.mediasStat,
            },
        }),
    );
}

function formatSpot(spot: any): Spot {
    const { _id, location, ...spotRes } = spot;

    return {
        ...spotRes,
        id: _id,
        location: {
            ...(location ?? {}),
            latitude: spotRes.geo ? spotRes.geo[1] : null,
            longitude: spotRes.geo ? spotRes.geo[0] : null,
        },
    } as Spot;
}

function addHashtagIfNeeded(tag: string) {
    return tag[0] !== '#' ? `#${tag}` : tag;
}

export const spotsRouter = router({
    getSpot: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const spot = await ctx.db.collection('spots').findOne<Spot>({ _id: new ObjectId(input.id) });
        return spot;
    }),

    getSpotsGeoJSON: publicProcedure
        .input(
            z.object({
                northEast: z.object({ latitude: z.number(), longitude: z.number() }),
                southWest: z.object({ latitude: z.number(), longitude: z.number() }),
            }),
        )
        .query(async ({ ctx, input }) => {
            const bottomLeft = [input.southWest.longitude, input.southWest.latitude];
            const topRight = [input.northEast.longitude, input.northEast.latitude];
            const spots = await ctx.db
                .collection('spots')
                .find({ geoLoc: { $geoWithin: { $box: [bottomLeft, topRight] } } })
                .toArray();

            return formatSpotsToGEOJson(spots.map((spot) => ({ id: spot._id, ...spot }) as unknown as Spot));
        }),

    listByTags: publicProcedure
        .input(
            z.object({
                tags: z.array(z.string()).min(1, 'You must give at least one tag'),
                tagsFromMedia: z.boolean().default(false),
                limit: z.number().default(2000),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (input.tagsFromMedia) {
                const spots = await ctx.db
                    .collection('medias')
                    .aggregate([
                        {
                            $match: {
                                hashtags: { $in: input.tags.map(addHashtagIfNeeded) },
                            },
                        },
                        {
                            $lookup: {
                                from: 'spots',
                                localField: 'spot',
                                foreignField: '_id',
                                as: 'spot_data',
                            },
                        },
                        {
                            $unwind: '$spot_data',
                        },
                        {
                            $group: {
                                _id: '$spot_data._id',
                                spot: { $first: '$spot_data' },
                            },
                        },
                        {
                            $replaceRoot: { newRoot: '$spot' },
                        },
                    ])
                    .toArray();

                return spots.map(formatSpot);
            }

            const spots = await ctx.db
                .collection('spots')
                .find<Spot>({
                    tags: { $in: input.tags },
                })
                .toArray();

            return spots.map(formatSpot);
        }),
});
