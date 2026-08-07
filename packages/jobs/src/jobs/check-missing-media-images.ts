import { MongoClient, ObjectId } from 'mongodb';

import { Prisma } from '@krak/prisma';

import { env } from '../env';
import { runJob } from '../lib/runJob';

runJob('check-missing-media-images', async ({ prisma }) => {
    const medias = await prisma.media.findMany({
        where: {
            type: 'IMAGE',
            OR: [
                { image: { equals: Prisma.AnyNull } },
                { image: { equals: '' } },
                { image: { equals: {} } },
                { image: { equals: [] } },
            ],
        },
        select: { id: true, spotId: true, addedById: true, image: true },
        orderBy: { createdAt: 'asc' },
    });

    console.log(`Found ${medias.length} image media item(s) with a null or empty image.`);
    if (medias.length === 0) return;

    const mongo = new MongoClient(env.MONGODB_URL);
    try {
        const ids = medias.map(({ id }) => id).filter((id) => ObjectId.isValid(id));
        const mongoMedias = await mongo
            .db(env.MONGODB_DATABASE)
            .collection('media')
            .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } }, { projection: { image: 1 } })
            .toArray();
        const mongoImages = new Map(mongoMedias.map((media) => [media['_id'].toString(), media.image]));
        const results = medias.map((media) => ({ ...media, mongoImage: mongoImages.get(media.id) ?? null }));

        console.log(
            `Found an image in Mongo for ${results.filter(({ mongoImage }) => mongoImage != null).length} item(s).`,
        );
        console.table(results);
    } finally {
        await mongo.close();
    }
});
