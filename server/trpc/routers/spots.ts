import { ObjectId } from 'mongodb';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { SpotGeoJSON, Spot } from 'lib/carrelageClient';

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
});
