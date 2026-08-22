import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import assert from 'node:assert/strict';
import PQueue from 'p-queue';

import { Prisma } from '@krak/prisma';

import { env } from '../env';
import { runJob } from '../lib/runJob';

type LegacyFile = { url?: unknown; width?: unknown; height?: unknown };

function legacyFile(value: unknown): LegacyFile {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function cloudinaryUrls(value: unknown): { video: string; thumbnail: string } | undefined {
    if (typeof value !== 'string') return;

    let video: URL;
    try {
        video = new URL(value);
    } catch {
        return;
    }
    if (video.hostname !== 'res.cloudinary.com' || !video.pathname.includes('/video/upload/')) return;

    video.protocol = 'https:';
    const thumbnail = new URL(video);
    video.pathname = video.pathname.replace(/\.[^./]+$/, '.mp4');
    thumbnail.pathname = thumbnail.pathname.replace(/\.[^./]+$/, '.webp');
    if (!video.pathname.endsWith('.mp4') || !thumbnail.pathname.endsWith('.webp')) return;

    return { video: video.toString(), thumbnail: thumbnail.toString() };
}

function createS3Client(): S3Client {
    if (!env.S3_ENDPOINT || !env.S3_REGION || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
        throw new Error('S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY, and S3_SECRET_KEY are required.');
    }

    return new S3Client({
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
    });
}

async function download(url: string, expectedType: 'video/' | 'image/'): Promise<Uint8Array> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cloudinary returned ${response.status} for ${url}`);

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith(expectedType)) {
        throw new Error(`Cloudinary returned ${contentType ?? 'no content type'} for ${url}`);
    }

    return new Uint8Array(await response.arrayBuffer());
}

async function upload(s3: S3Client, key: string, body: Uint8Array, contentType: string): Promise<void> {
    if (!env.S3_BUCKET) throw new Error('S3_BUCKET is required.');
    await s3.send(
        new PutObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: 'public-read',
        }),
    );
}

if (Bun.argv.includes('--self-check')) {
    assert.deepEqual(cloudinaryUrls('http://res.cloudinary.com/krak/video/upload/v1/medias/example.mov'), {
        video: 'https://res.cloudinary.com/krak/video/upload/v1/medias/example.mp4',
        thumbnail: 'https://res.cloudinary.com/krak/video/upload/v1/medias/example.webp',
    });
    assert.equal(cloudinaryUrls('https://example.com/video.mp4'), undefined);
    console.log('Cloudinary URL checks passed.');
} else {
    runJob('migrate-cloudinary-videos', async ({ prisma }) => {
        const s3 = createS3Client();
        const medias = await prisma.media.findMany({
            where: { type: 'VIDEO', video: { not: Prisma.DbNull } },
            select: { id: true, image: true, video: true },
        });
        const cloudinaryMedias = medias.flatMap((media) => {
            const video = legacyFile(media.video);
            const urls = cloudinaryUrls(video.url);
            return urls ? [{ ...media, video, urls }] : [];
        });
        console.log(`Found ${cloudinaryMedias.length} Cloudinary video(s) to migrate.`);

        let migrated = 0;
        let failed = 0;
        // ponytail: two buffered videos cap memory; use streaming multipart uploads if video sizes grow.
        const queue = new PQueue({ concurrency: 2 });
        await queue.addAll(
            cloudinaryMedias.map(({ id, image, video, urls }) => async () => {
                const videoKey = `assets/medias/${id}.mp4`;
                const thumbnailKey = `assets/medias/${id}.webp`;

                try {
                    await upload(s3, videoKey, await download(urls.video, 'video/'), 'video/mp4');
                    await upload(s3, thumbnailKey, await download(urls.thumbnail, 'image/'), 'image/webp');

                    const legacyImage = legacyFile(image);
                    const width = typeof video.width === 'number' ? video.width : 0;
                    const height = typeof video.height === 'number' ? video.height : 0;
                    await prisma.media.update({
                        where: { id },
                        data: {
                            image: {
                                provider: 's3',
                                key: thumbnailKey,
                                width: typeof legacyImage.width === 'number' ? legacyImage.width : width,
                                height: typeof legacyImage.height === 'number' ? legacyImage.height : height,
                            },
                            video: {
                                publicId: videoKey,
                                version: '',
                                url: `${env.DO_CDN_ENDPOINT.replace(/\/$/, '')}/${videoKey}`,
                                format: 'mp4',
                                width,
                                height,
                            },
                        },
                    });
                    migrated++;
                } catch (error) {
                    process.stdout.write('\r\x1b[K');
                    console.warn(`Failed to migrate ${id}:`, error);
                    failed++;
                }

                process.stdout.write(
                    `\r\x1b[KMigrated ${migrated}/${cloudinaryMedias.length} Cloudinary video(s); ${failed} failed.`,
                );
            }),
        );

        if (cloudinaryMedias.length > 0) process.stdout.write('\n');
        if (failed > 0) throw new Error(`${failed} Cloudinary video migration(s) failed.`);
    });
}
