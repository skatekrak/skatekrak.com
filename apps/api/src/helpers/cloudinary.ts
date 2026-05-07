import crypto from 'crypto';

import { env } from '../env';

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
// Upload helper (direct API call — no SDK)
// ============================================================================

/**
 * Sign a set of Cloudinary upload params with the API secret.
 * See https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
 */
function signParams(params: Record<string, string>, apiSecret: string): string {
    const sorted = Object.keys(params)
        .toSorted()
        .filter((k) => params[k] !== undefined && params[k] !== '')
        .map((k) => `${k}=${params[k]}`)
        .join('&');
    return crypto
        .createHash('sha1')
        .update(sorted + apiSecret)
        .digest('hex');
}

/**
 * Upload a file buffer to Cloudinary (signed upload via REST API).
 *
 * Bypasses the Cloudinary Node SDK entirely to avoid bundler compatibility
 * issues with Bun. Uses the Upload API directly with fetch().
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

    const timestamp = String(Math.floor(Date.now() / 1000));

    // Build the params that need signing
    const paramsToSign: Record<string, string> = {
        folder,
        timestamp,
    };

    if (resourceType === 'image') {
        paramsToSign.format = 'webp';
        paramsToSign.quality = 'auto';
        paramsToSign.transformation = `c_scale,w_${DEFAULT_WIDTH}`;
    } else {
        paramsToSign.format = 'mp4';
        paramsToSign.video_codec = 'auto';
        paramsToSign.transformation = `c_scale,w_${DEFAULT_WIDTH}`;
    }

    const signature = signParams(paramsToSign, env.CLOUDINARY_SECRET_KEY);

    // Build the multipart form data
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: mimeType }), 'upload');
    formData.append('api_key', env.CLOUDINARY_API_KEY);
    formData.append('signature', signature);

    for (const [key, value] of Object.entries(paramsToSign)) {
        formData.append(key, value);
    }

    const url = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const result = (await response.json()) as Record<string, unknown>;

    if (!response.ok || result.error) {
        const errorMessage =
            (result.error as Record<string, string>)?.message ?? `Cloudinary upload failed (${response.status})`;
        throw new Error(errorMessage);
    }

    return {
        publicId: result.public_id as string,
        version: String(result.version),
        url: result.secure_url as string,
        format: result.format as string,
        width: result.width as number,
        height: result.height as number,
    };
}
