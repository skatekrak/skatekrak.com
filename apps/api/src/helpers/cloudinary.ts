import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';
import { Readable } from 'node:stream';

import { env } from '../env';

// ============================================================================
// Configuration
// ============================================================================

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_SECRET_KEY,
});

// ============================================================================
// Constants (matching carrelage)
// ============================================================================

const DEFAULT_WIDTH = 1080;
const MAX_IMAGE_SIZE = 20 * 1_000_000; // 20 MB
const MAX_VIDEO_SIZE = 100 * 1_000_000; // 100 MB

// ============================================================================
// Types
// ============================================================================

export type CloudinaryUploadResult = {
    publicId: string;
    version: string;
    url: string;
    format: string;
    width: number;
    height: number;
};

// ============================================================================
// Upload helper
// ============================================================================

/**
 * Upload a file buffer to Cloudinary.
 *
 * Ported from carrelage's `helpers/cloudinary.js` — same folder structure,
 * format conversion (webp for images, mp4 for videos), and size limits.
 */
export async function uploadToCloudinary(
    buffer: Buffer,
    mimeType: string,
    folder: string,
): Promise<CloudinaryUploadResult> {
    const resourceType = mimeType.split('/')[0] as string;

    if (resourceType !== 'image' && resourceType !== 'video') {
        throw new Error(`Unsupported file type: ${resourceType}`);
    }

    if (resourceType === 'image' && buffer.byteLength > MAX_IMAGE_SIZE) {
        throw new Error(`Image exceeds maximum size of 20 MB`);
    }
    if (resourceType === 'video' && buffer.byteLength > MAX_VIDEO_SIZE) {
        throw new Error(`Video exceeds maximum size of 100 MB`);
    }

    const options: UploadApiOptions = {
        folder,
        upload_preset: 'medias',
        resource_type: resourceType as 'image' | 'video',
        width: DEFAULT_WIDTH,
        crop: 'scale',
    };

    if (resourceType === 'image') {
        options.format = 'webp';
        options.quality = 'auto';
    } else {
        options.format = 'mp4';
        options.video_codec = 'auto';
    }

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error || !result) {
                return reject(error ?? new Error('Cloudinary upload failed'));
            }
            resolve({
                publicId: result.public_id,
                version: String(result.version),
                url: result.secure_url,
                format: result.format,
                width: result.width,
                height: result.height,
            });
        });

        const readable = Readable.from(buffer);
        readable.pipe(uploadStream);
    });
}
