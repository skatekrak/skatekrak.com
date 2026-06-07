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

    const totalBatches = Math.ceil(documents.length / BATCH_SIZE);
    console.log(`Indexing ${documents.length} map(s) into Meilisearch in ${totalBatches} batch(es)...`);

    const taskUids: number[] = [];

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
        const batch = documents.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

        const task = await mapIndex.addDocuments(batch, { primaryKey: 'id' });
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
});
