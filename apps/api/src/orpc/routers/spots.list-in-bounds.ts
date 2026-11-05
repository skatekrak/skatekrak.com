import { Prisma } from '@krak/prisma';

import { getSpotBoundsWhere } from '../../helpers/map-bounds';
import { os } from '../base';
import { formatPrismaMedia, formatPrismaSpot } from '../formatters';

const addedByInclude = { addedBy: { include: { user: { select: { username: true } } } } } as const;

export const listInBounds = os.spots.listInBounds.handler(async ({ context, input }) => {
    const now = new Date();
    const spots = await context.prisma.spot.findMany({
        relationLoadStrategy: 'join',
        where: getSpotBoundsWhere(input),
        orderBy: [{ medias: { _count: 'desc' } }, { id: 'asc' }],
        skip: input.offset,
        take: input.limit,
        include: {
            ...addedByInclude,
            medias: {
                where: {
                    createdAt: { lt: now },
                    OR: [{ image: { not: Prisma.AnyNull } }, { video: { not: Prisma.AnyNull } }],
                    AND: [{ OR: [{ releaseDate: null }, { releaseDate: { lt: now } }] }],
                },
                orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
                take: 1,
                include: addedByInclude,
            },
        },
    });

    return spots.map((spot) => ({
        spot: formatPrismaSpot(spot),
        mediaThumbnail: spot.medias[0] ? formatPrismaMedia(spot.medias[0]) : null,
    }));
});
