import type { Prisma } from '@krak/prisma';

type MapBounds = {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
};

const normalizeLongitude = (longitude: number) => ((((longitude + 180) % 360) + 360) % 360) - 180;

export const getSpotBoundsWhere = ({ northEast, southWest }: MapBounds): Prisma.SpotWhereInput => {
    const east = normalizeLongitude(northEast.longitude);
    const west = normalizeLongitude(southWest.longitude);
    const coversWorld = Math.abs(northEast.longitude - southWest.longitude) >= 360;

    return {
        latitude: { gte: southWest.latitude, lte: northEast.latitude },
        ...(coversWorld
            ? {}
            : east >= west
              ? { longitude: { gte: west, lte: east } }
              : { OR: [{ longitude: { gte: west } }, { longitude: { lte: east } }] }),
    };
};
