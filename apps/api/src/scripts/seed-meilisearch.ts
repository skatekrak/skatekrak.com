import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@krak/prisma';

import { env } from '../env';
import { spotIndex } from '../helpers/meilisearch';
import client from '../helpers/meilisearch';

const BATCH_SIZE = 500;

async function seedMeilisearch() {
    console.log('Connecting to database...');
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    console.log('Fetching all spots...');
    const spots = await prisma.spot.findMany();
    console.log(`Found ${spots.length} spots`);

    if (spots.length === 0) {
        console.log('No spots to index. Exiting.');
        return;
    }

    const documents = spots.map((spot) => ({
        objectID: spot.id,
        name: spot.name,
        coverURL: spot.coverURL ?? '',
        type: spot.type.toLowerCase(),
        status: spot.status.toLowerCase(),
        indoor: spot.indoor,
        tags: spot.tags,
        obstacles: spot.obstacles,
        facebook: spot.facebook ?? undefined,
        instagram: spot.instagram ?? undefined,
        snapchat: spot.snapchat ?? undefined,
        website: spot.website ?? undefined,
        location: {
            streetName: spot.streetName ?? '',
            streetNumber: spot.streetNumber ?? '',
            city: spot.city ?? '',
            country: spot.country ?? '',
        },
        _geo: {
            lat: spot.latitude,
            lng: spot.longitude,
        },
    }));

    const totalBatches = Math.ceil(documents.length / BATCH_SIZE);
    console.log(`Indexing ${documents.length} spots into Meilisearch in ${totalBatches} batch(es)...`);

    const taskUids: number[] = [];

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
        const batch = documents.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

        const task = await spotIndex.addDocuments(batch, { primaryKey: 'objectID' });
        taskUids.push(task.taskUid);
        console.log(
            `  Batch ${batchNumber}/${totalBatches}: enqueued ${batch.length} documents (taskUid: ${task.taskUid})`,
        );
    }

    console.log('Waiting for Meilisearch to process all tasks...');

    for (const taskUid of taskUids) {
        const result = await client.tasks.waitForTask(taskUid);
        if (result.status === 'failed') {
            console.error(`  Task ${taskUid} failed:`, result.error);
        } else {
            console.log(`  Task ${taskUid}: ${result.status}`);
        }
    }

    console.log('Done! All spots have been indexed.');
}

seedMeilisearch().catch((err) => {
    console.error('Failed to seed Meilisearch:', err);
    process.exit(1);
});
