import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '../env';

// ============================================================================
// S3 Client (DigitalOcean Spaces — S3-compatible)
// ============================================================================

const s3 = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
    },
});

// ============================================================================
// Upload helper
// ============================================================================

/**
 * Upload a buffer to S3 (DigitalOcean Spaces).
 *
 * @param key - The object key (path) in the bucket, e.g. `assets/maps/custom-maps/famous.png`
 * @param body - The file contents as a Buffer
 * @param contentType - MIME type, e.g. `image/png`
 */
export async function uploadToS3(key: string, body: Buffer, contentType: string): Promise<void> {
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
