import type { PrismaClient } from '@krak/prisma';

import { runJob } from '../lib/runJob';

type Stat = {
    createdAt: string;
    className: 'Stat';
    all: number;
    monthly: number;
    weekly: number;
    daily: number;
};

function emptyStat(now: Date): Stat {
    return { createdAt: now.toISOString(), className: 'Stat', all: 0, monthly: 0, weekly: 0, daily: 0 };
}

function bumpStat(stat: Stat, createdAt: Date, now: Date): void {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    stat.all += 1;
    if (createdAt >= monthStart) stat.monthly += 1;
    if (createdAt >= sevenDaysAgo) stat.weekly += 1;
    if (createdAt >= yesterday) stat.daily += 1;
}

async function updateSpotStats(prisma: PrismaClient, statsBySpotId: Map<string, Stat>): Promise<void> {
    const total = statsBySpotId.size;
    let updated = 0;

    for (const [spotId, mediasStat] of statsBySpotId) {
        await prisma.spot.update({ where: { id: spotId }, data: { mediasStat } });
        updated += 1;

        if (updated % 500 === 0 || updated === total) {
            console.log(`Updated ${updated}/${total} spot media stats.`);
        }
    }
}

runJob('recompute-spot-media-stats', async ({ prisma }) => {
    const now = new Date();

    console.log('Loading spots...');
    const spots = await prisma.spot.findMany({ select: { id: true } });
    console.log(`Loaded ${spots.length} spot(s).`);

    console.log('Loading media...');
    const medias = await prisma.media.findMany({
        where: { spotId: { not: null } },
        select: { spotId: true, createdAt: true },
    });
    console.log(`Loaded ${medias.length} media item(s).`);

    console.log('Computing media stats...');
    const statsBySpotId = new Map(spots.map((spot) => [spot.id, emptyStat(now)]));

    for (const media of medias) {
        if (!media.spotId) continue;
        const stat = statsBySpotId.get(media.spotId);
        if (stat) bumpStat(stat, media.createdAt, now);
    }
    console.log(`Computed media stats for ${statsBySpotId.size} spot(s).`);

    console.log('Updating spot media stats...');
    await updateSpotStats(prisma, statsBySpotId);

    console.log(`Updated media stats for ${spots.length} spot(s) from ${medias.length} media item(s).`);
});
