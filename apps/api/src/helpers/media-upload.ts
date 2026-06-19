import { createId } from '@paralleldrive/cuid2';

import { env } from '../env';
import { uploadToS3 } from './s3';
import { processVideo } from './video';

// ============================================================================
// Types
// ============================================================================

export type MediaUploadResult = {
    /** Pre-generated cuid2 ID (only set for images uploaded to S3) */
    mediaId: string | undefined;
    /** Prisma MediaType value */
    mediaType: 'IMAGE' | 'VIDEO';
    /** Image field for the Prisma record (S3 or Cloudinary thumbnail) */
    imageField: Record<string, unknown>;
    /** Video field for the Prisma record (Cloudinary, only for videos) */
    videoField: Record<string, unknown> | undefined;
};

// ============================================================================
// Process and upload a media file
// ============================================================================

/**
 * Validates, processes, and uploads a media file.
 *
 * - Images are converted to WebP via sharp and uploaded to S3.
 * - Videos are transcoded to H.264 MP4 (+ WebP poster) and uploaded to S3.
 *
 * Returns the fields needed to create a Prisma `Media` record.
 *
 * @throws {Error} if the file type is unsupported
 */
export async function processMediaFile(file: File): Promise<MediaUploadResult> {
    const mimeType = file.type || 'application/octet-stream';
    const resourceType = mimeType.split('/')[0] as string;

    if (resourceType !== 'image' && resourceType !== 'video') {
        throw new Error(`Unsupported file type: ${mimeType}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isVideo = resourceType === 'video';

    if (isVideo) {
        const { mp4Buffer, width, height, thumbBuffer, thumbWidth, thumbHeight } = await processVideo(buffer);

        const mediaId = createId();
        const mp4Key = `assets/medias/${mediaId}.mp4`;
        const thumbKey = `assets/medias/${mediaId}.webp`;
        await Promise.all([
            uploadToS3(mp4Key, mp4Buffer, 'video/mp4'),
            uploadToS3(thumbKey, thumbBuffer, 'image/webp'),
        ]);

        return {
            mediaId: undefined,
            mediaType: 'VIDEO',
            // ponytail: keeps CloudinaryFileSchema output shape so the frontend is unchanged.
            imageField: { provider: 's3', key: thumbKey, width: thumbWidth, height: thumbHeight },
            videoField: {
                publicId: mp4Key,
                version: '',
                url: `${env.DO_CDN_ENDPOINT.replace(/\/$/, '')}/${mp4Key}`,
                format: 'mp4',
                width,
                height,
            },
        };
    }

    const { default: sharp } = await import('sharp');
    const { data: webpBuffer, info } = await sharp(buffer).rotate().webp().toBuffer({ resolveWithObject: true });
    const width = info.width ?? 0;
    const height = info.height ?? 0;

    const mediaId = createId();
    const s3Key = `assets/medias/${mediaId}.webp`;
    await uploadToS3(s3Key, webpBuffer, 'image/webp');

    return {
        mediaId,
        mediaType: 'IMAGE',
        imageField: { provider: 's3', key: s3Key, width, height },
        videoField: undefined,
    };
}
