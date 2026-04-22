import { getImgproxyUrl, type ImgproxyOptions } from '@krak/utils';

/**
 * Resolve a media image object to a displayable URL.
 *
 * - S3 images (provider === 's3') are served through imgproxy.
 * - Legacy Cloudinary images (no provider field) use the pre-built URL.
 */
export function getMediaImageUrl(
    image: { provider?: string; key?: string; url?: string; [key: string]: unknown },
    imgproxyBaseUrl: string,
    options?: ImgproxyOptions,
): string {
    if (image.provider === 's3' && image.key) {
        return getImgproxyUrl(imgproxyBaseUrl, image.key, options);
    }
    // Legacy Cloudinary — use the existing URL
    return (image.url as string) ?? '';
}
