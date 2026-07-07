import client, { buildMapDocument, mapIndex } from '../lib/meilisearch';
import { runJob } from '../lib/runJob';

const BATCH_SIZE = 500;

/**
 * Initial load of the Meilisearch maps index.
 * Fetches every Map from PostgreSQL and (re)indexes them in batches.
 * Incremental add/update/delete is handled by the API's admin router.
 */
runJob('seed-maps', async ({ prisma }) => {
    const maps = await prisma.map.findMany();
    console.log(`Found ${maps.length} map(s).`);

    if (maps.length === 0) {
        return;
    }

    const documents = maps.map(buildMapDocument);
    console.log(`Indexing ${documents.length} map(s) into Meilisearch...`);

    const enqueued = await Promise.all(mapIndex.addDocumentsInBatches(documents, BATCH_SIZE, { primaryKey: 'id' }));
    const results = await client.tasks.waitForTasks(enqueued);

    const failed = results.filter((r) => r.status === 'failed');
    if (failed.length)
        console.error(
            `${failed.length} batch(es) failed:`,
            failed.map((r) => r.error),
        );
    else console.log(`Done: ${results.length} batch(es) succeeded.`);
});
