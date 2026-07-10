import type { PrismaClient } from '@krak/prisma';

import { runJob } from '../lib/runJob';

const batchSize = 500;

type Stat = {
    createdAt: string;
    className: 'Stat';
    all: number;
    monthly: number;
    weekly: number;
    daily: number;
};

type CountBySpot = {
    spotId: string | null;
    _count: { spotId: number };
};

function emptyStat(now: Date): Stat {
    return { createdAt: now.toISOString(), className: 'Stat', all: 0, monthly: 0, weekly: 0, daily: 0 };
}

function countBySpot(rows: CountBySpot[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const row of rows) {
        // oxlint-disable-next-line no-underscore-dangle
        if (row.spotId) counts.set(row.spotId, row._count.spotId);
    }

    return counts;
}

async function updateSpotStats(
    prisma: PrismaClient,
    counts: {
        all: Map<string, number>;
        monthly: Map<string, number>;
        weekly: Map<string, number>;
        daily: Map<string, number>;
    },
    now: Date,
    total: number,
): Promise<void> {
    let cursor: string | undefined;
    let updated = 0;

    while (true) {
        const spots = await prisma.spot.findMany({
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: { id: 'asc' },
            select: { id: true },
            take: batchSize,
        });

        if (spots.length === 0) break;

        await prisma.$transaction(
            spots.map((spot) => {
                const mediasStat = {
                    ...emptyStat(now),
                    all: counts.all.get(spot.id) ?? 0,
                    monthly: counts.monthly.get(spot.id) ?? 0,
                    weekly: counts.weekly.get(spot.id) ?? 0,
                    daily: counts.daily.get(spot.id) ?? 0,
                };

                return prisma.spot.update({ where: { id: spot.id }, data: { mediasStat } });
            }),
        );

        updated += spots.length;
        cursor = spots.at(-1)?.id;

        console.log(`Updated ${updated}/${total} spot media stats.`);
    }
}

runJob('recompute-spot-media-stats', async ({ prisma }) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    console.log('Counting spots and media...');
    const [totalSpots, totalMedia, allRows, monthlyRows, weeklyRows, dailyRows] = await Promise.all([
        prisma.spot.count(),
        prisma.media.count({ where: { spotId: { not: null } } }),
        prisma.media.groupBy({ by: ['spotId'], where: { spotId: { not: null } }, _count: { spotId: true } }),
        prisma.media.groupBy({
            by: ['spotId'],
            where: { spotId: { not: null }, createdAt: { gte: monthStart } },
            _count: { spotId: true },
        }),
        prisma.media.groupBy({
            by: ['spotId'],
            where: { spotId: { not: null }, createdAt: { gte: sevenDaysAgo } },
            _count: { spotId: true },
        }),
        prisma.media.groupBy({
            by: ['spotId'],
            where: { spotId: { not: null }, createdAt: { gte: yesterday } },
            _count: { spotId: true },
        }),
    ]);

    const counts = {
        all: countBySpot(allRows),
        monthly: countBySpot(monthlyRows),
        weekly: countBySpot(weeklyRows),
        daily: countBySpot(dailyRows),
    };

    console.log(`Counted ${totalMedia} media item(s) for ${totalSpots} spot(s).`);

    console.log('Updating spot media stats...');
    await updateSpotStats(prisma, counts, now, totalSpots);

    console.log(`Updated media stats for ${totalSpots} spot(s) from ${totalMedia} media item(s).`);
});
