import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import PQueue from 'p-queue';

import { Prisma } from '@krak/prisma';

import { env } from '../env';
import { runJob } from '../lib/runJob';

type LegacyImage = { url?: unknown; width?: unknown; height?: unknown };

const transfer = Bun.argv.includes('--transfer');

function createS3Client(): S3Client {
    if (!env.S3_ENDPOINT || !env.S3_REGION || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
        throw new Error('S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY, and S3_SECRET_KEY are required with --transfer.');
    }

    return new S3Client({
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
    });
}

async function transferFromCloudinary(s3: S3Client, image: LegacyImage, key: string): Promise<void> {
    if (typeof image.url !== 'string') throw new Error('Legacy image has no URL.');

    const url = new URL(image.url);
    if (url.hostname !== 'res.cloudinary.com') {
        throw new Error(`Refusing non-Cloudinary URL: ${url.origin}`);
    }
    url.protocol = 'https:';
    if (!url.pathname.includes('/upload/')) throw new Error(`Invalid Cloudinary image URL: ${image.url}`);
    url.pathname = url.pathname.replace('/upload/', '/upload/f_webp/');

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cloudinary returned ${response.status}.`);
    if (!response.headers.get('content-type')?.startsWith('image/')) {
        throw new Error(`Cloudinary returned ${response.headers.get('content-type') ?? 'no content type'}.`);
    }
    if (!env.S3_BUCKET) throw new Error('S3_BUCKET is required with --transfer.');

    await s3.send(
        new PutObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: key,
            Body: new Uint8Array(await response.arrayBuffer()),
            ContentType: 'image/webp',
            ACL: 'public-read',
        }),
    );
}

async function existsInS3(key: string): Promise<boolean | undefined> {
    for (let attempt = 1; attempt <= 3; attempt++) {
        let response: Response;
        try {
            response = await fetch(`${env.DO_CDN_ENDPOINT.replace(/\/$/, '')}/${key}`, { method: 'HEAD' });
        } catch (error) {
            if (attempt === 3) {
                console.warn(`Could not check ${key} after 3 attempts:`, error);
                return undefined;
            }
            await Bun.sleep(500 * attempt);
            continue;
        }

        if (response.ok) return true;
        if (response.status === 403 || response.status === 404) return false;
        if (response.status < 500 && response.status !== 429) {
            throw new Error(`Failed to check ${key}: CDN returned ${response.status}`);
        }
        if (attempt === 3) {
            console.warn(`Could not check ${key} after 3 attempts: CDN returned ${response.status}.`);
            return undefined;
        }

        await Bun.sleep(500 * attempt);
    }
}

runJob('reconcile-media-s3', async ({ prisma }) => {
    const s3 = transfer ? createS3Client() : undefined;
    const medias = await prisma.media.findMany({
        where: { type: 'IMAGE', image: { not: Prisma.DbNull } },
        select: { id: true, image: true },
    });
    const legacyMedias = medias.filter(
        ({ image }) => image !== null && typeof image === 'object' && !Array.isArray(image) && image.provider !== 's3',
    );
    console.log(`Found ${legacyMedias.length} legacy photo(s) to check.`);

    let checked = 0;
    let failed = 0;
    let missing = 0;
    let transferred = 0;
    let updated = 0;

    const queue = new PQueue({ concurrency: 10 });
    await queue.addAll(
        legacyMedias.map(({ id, image }) => async () => {
            const key = `assets/medias/${id}.webp`;
            let exists = await existsInS3(key);
            const legacyImage = image as LegacyImage;
            if (exists === false && s3) {
                try {
                    await transferFromCloudinary(s3, legacyImage, key);
                    exists = true;
                    transferred++;
                } catch (error) {
                    console.warn(`Could not transfer ${id}:`, error);
                    exists = undefined;
                }
            }

            if (exists === undefined) {
                process.stdout.write('\r\x1b[K');
                console.warn('Failed media:', { id, image });
                failed++;
            } else if (exists) {
                await prisma.media.update({
                    where: { id },
                    data: {
                        image: {
                            provider: 's3',
                            key,
                            width: typeof legacyImage.width === 'number' ? legacyImage.width : 0,
                            height: typeof legacyImage.height === 'number' ? legacyImage.height : 0,
                        },
                    },
                });
                updated++;
            } else {
                missing++;
            }

            checked++;
            process.stdout.write(
                `\r\x1b[KChecked ${checked}/${legacyMedias.length}: ${updated} updated, ${transferred} transferred, ${missing} missing, ${failed} failed.`,
            );
        }),
    );

    if (checked > 0) process.stdout.write('\n');
    console.log(
        `Checked ${checked} legacy photo(s): ${updated} updated, ${transferred} transferred, ${missing} missing from S3, ${failed} failed.`,
    );
});
