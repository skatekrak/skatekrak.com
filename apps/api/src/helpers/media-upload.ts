import { createId } from '@paralleldrive/cuid2';

import { uploadToCloudinary } from './cloudinary';
import { uploadToS3 } from './s3';

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
 * - Videos are uploaded to Cloudinary as-is.
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
        const cloudinaryFile = await uploadToCloudinary(buffer, mimeType, 'medias');
        return {
            mediaId: undefined,
            mediaType: 'VIDEO',
            imageField: { publicId: cloudinaryFile.publicId, url: cloudinaryFile.url.replace('.mp4', '.webp') },
            videoField: cloudinaryFile,
        };
    }

    const { default: sharp } = await import('sharp');
    const webpBuffer = await sharp(buffer).webp().toBuffer();
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

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
