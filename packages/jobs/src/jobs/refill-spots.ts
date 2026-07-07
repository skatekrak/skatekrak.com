import client, { buildSpotDocument, spotIndex } from '../lib/meilisearch';
import { runJob } from '../lib/runJob';

const BATCH_SIZE = 500;

runJob('refill-spots', async ({ prisma }) => {
    const spots = await prisma.spot.findMany();
    console.log(`Found ${spots.length} spot(s).`);

    console.log('Clearing Meilisearch spots index...');
    const deleteTask = await spotIndex.deleteAllDocuments();
    const deleteResult = await client.tasks.waitForTask(deleteTask.taskUid);
    if (deleteResult.status === 'failed')
        throw new Error(`Failed to clear spots index: ${deleteResult.error?.message}`);

    if (spots.length === 0) return;

    const documents = spots.map(buildSpotDocument);
    console.log(`Indexing ${documents.length} spot(s) into Meilisearch...`);

    const enqueued = await Promise.all(
        spotIndex.addDocumentsInBatches(documents, BATCH_SIZE, { primaryKey: 'objectID' }),
    );
    const results = await client.tasks.waitForTasks(enqueued);

    const failed = results.filter((r) => r.status === 'failed');
    if (failed.length)
        throw new Error(
            `${failed.length} batch(es) failed: ${failed.map((r) => r.error?.message ?? 'unknown error').join(', ')}`,
        );

    console.log(`Done: ${results.length} batch(es) succeeded.`);
});
