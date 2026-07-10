import { MongoClient, ObjectId, type Document } from 'mongodb';

import type { PrismaClient } from '@krak/prisma';

import { env } from '../env';
import { runJob } from '../lib/runJob';

const dryRun = process.argv.includes('--dry-run');
const spotIdArg = process.argv.find((arg) => arg.startsWith('--spot-id='))?.slice('--spot-id='.length);
const batchSize = 500;

function toId(value: unknown): string {
    if (value instanceof ObjectId) return value.toHexString();
    return String(value ?? '');
}

function mediaSpotId(media: Document): string {
    return toId(media.spot);
}

function mediaId(media: Document): string {
    return toId(media.id ?? media['_id']);
}

function chunks<T>(items: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
    return result;
}

async function countUnlinkedMedia(prisma: PrismaClient, mediaIds: string[]) {
    let count = 0;
    for (const ids of chunks(mediaIds, batchSize)) {
        count += await prisma.media.count({ where: { id: { in: ids }, spotId: null } });
    }
    return count;
}

async function countExistingMedia(prisma: PrismaClient, mediaIds: string[]) {
    let count = 0;
    for (const ids of chunks(mediaIds, batchSize)) {
        count += await prisma.media.count({ where: { id: { in: ids } } });
    }
    return count;
}

runJob('link-missing-spot-media', async ({ prisma }) => {
    const mongo = new MongoClient(env.MONGODB_URL);

    try {
        await mongo.connect();
        const mongoDb = mongo.db(env.MONGODB_DATABASE);
        const mongoMedia = await mongoDb.collection('media').find().toArray();
        const links = mongoMedia
            .map((media) => ({ id: mediaId(media), spotId: mediaSpotId(media) }))
            .filter((link) => link.id && link.spotId && (!spotIdArg || link.spotId === spotIdArg));
        const existingSpotIds = new Set(
            (
                await prisma.spot.findMany({
                    where: { id: { in: [...new Set(links.map((link) => link.spotId))] } },
                    select: { id: true },
                })
            ).map((spot) => spot.id),
        );
        const linksBySpotId = new Map<string, typeof links>();
        for (const link of links) {
            if (!existingSpotIds.has(link.spotId)) continue;
            const spotLinks = linksBySpotId.get(link.spotId) ?? [];
            spotLinks.push(link);
            linksBySpotId.set(link.spotId, spotLinks);
        }
        const mediaIds = links.map((link) => link.id);
        const linkableMediaIds = [...linksBySpotId.values()].flat().map((link) => link.id);
        const existingMediaCount = await countExistingMedia(prisma, mediaIds);
        const unlinkedCount = await countUnlinkedMedia(prisma, mediaIds);
        const linkableUnlinkedCount = await countUnlinkedMedia(prisma, linkableMediaIds);
        let updated = 0;
        let processedSpots = 0;

        console.log(`Found ${mongoMedia.length} Mongo media item(s) in ${env.MONGODB_DATABASE}.media.`);
        console.log(
            `Found ${links.length} media item(s) with a Mongo spot${spotIdArg ? ` for spot ${spotIdArg}` : ''}.`,
        );
        console.log(
            `Found ${existingSpotIds.size} matching Postgres spot(s), ${existingMediaCount} matching Postgres media item(s), and ${unlinkedCount} unlinked media item(s).`,
        );
        console.log(
            `Plan: link up to ${linkableUnlinkedCount} media item(s) across ${linksBySpotId.size} spot(s); ${links.length - linkableMediaIds.length} media item(s) reference missing spots.`,
        );

        if (dryRun) {
            console.log('Dry run: no media linked.');
            return;
        }

        for (const [spotId, spotLinks] of linksBySpotId) {
            for (const ids of chunks(
                spotLinks.map((link) => link.id),
                batchSize,
            )) {
                const result = await prisma.media.updateMany({
                    where: { id: { in: ids }, spotId: null },
                    data: { spotId },
                });
                updated += result.count;
            }

            processedSpots++;
            console.log(
                `Linked ${updated}/${linkableUnlinkedCount} media item(s) after ${processedSpots}/${linksBySpotId.size} spot(s); latest spot ${spotId} had ${spotLinks.length} candidate media item(s).`,
            );
        }

        console.log(`Linked ${updated} media item(s).`);
    } finally {
        await mongo.close();
    }
});
