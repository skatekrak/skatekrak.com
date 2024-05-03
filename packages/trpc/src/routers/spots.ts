import { ObjectId } from 'mongodb';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { SpotGeoJSON, Spot } from '@krak/carrelage-client';
import { TRPCError } from '@trpc/server';
import { differenceInMinutes, isAfter } from 'date-fns';

const formatSpotsToGEOJson = (spots: Spot[]) => {
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
};

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

const isSpotInBound = (bounds: [[number, number], [number, number]]): ((spot: SpotGeoJSON) => boolean) => {
    return (spot) => {
        if (
            spot.geometry.coordinates[0] >= bounds[0][0] &&
            spot.geometry.coordinates[0] <= bounds[1][0] &&
            spot.geometry.coordinates[1] >= bounds[0][1] &&
            spot.geometry.coordinates[1] <= bounds[1][1]
        ) {
            return true;
        } else {
            return false;
        }
    };
};

/// In Memory cache
let _allGeoJSONSpots: SpotGeoJSON[] | null = null;
let lastCacheUpdate = Date.now();

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
            if (_allGeoJSONSpots == null || differenceInMinutes(lastCacheUpdate, Date.now())) {
                try {
                    console.time('fetching spots');
                    const spots = await ctx.db.collection('spots').find().toArray();
                    console.timeEnd('fetching spots');

                    lastCacheUpdate = Date.now();

                    _allGeoJSONSpots = formatSpotsToGEOJson(
                        spots.map((spot) => ({ id: spot._id, ...spot }) as unknown as Spot),
                    );
                } catch (err) {
                    console.error(err);
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: "We messed something up while retrieving the spots. We've been notices, we're on it.",
                    });
                }
            } else {
                console.log('Using cache');
            }

            const bottomLeft: [number, number] = [input.southWest.longitude, input.southWest.latitude];
            const topRight: [number, number] = [input.northEast.longitude, input.northEast.latitude];

            return _allGeoJSONSpots.filter(isSpotInBound([bottomLeft, topRight]));
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
