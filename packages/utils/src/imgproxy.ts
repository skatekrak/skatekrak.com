type ResizingType = 'fit' | 'fill' | 'fill-down' | 'force' | 'auto';

type Gravity = 'no' | 'so' | 'ea' | 'we' | 'noea' | 'nowe' | 'soea' | 'sowe' | 'ce' | 'sm';

export interface ImgproxyOptions {
    /** Resizing type. Default: 'fit' */
    resizingType?: ResizingType;
    /** Target width in pixels. 0 = auto from aspect ratio */
    width?: number;
    /** Target height in pixels. 0 = auto from aspect ratio */
    height?: number;
    /** Gravity for cropping. Default: 'ce' (center) */
    gravity?: Gravity;
    /** Enlarge if smaller than target. Default: false */
    enlarge?: boolean;
    /** Quality percentage (1-100) */
    quality?: number;
    /** Output format (e.g. 'webp', 'png', 'jpg') */
    format?: string;
    /** Device pixel ratio multiplier */
    dpr?: number;
    /** Gaussian blur sigma */
    blur?: number;
}

/**
 * Build a valid imgproxy URL with optional processing options.
 *
 * @param baseUrl - The imgproxy instance base URL (e.g. 'https://img.skatekrak.com')
 * @param path - The source image path (e.g. 'maps/custom-maps/abc123.png')
 * @param options - Optional processing parameters (resize, quality, format, etc.)
 * @returns The full imgproxy URL
 *
 * @example
 * ```ts
 * // Simple — no processing
 * getImgproxyUrl('https://img.skatekrak.com', 'maps/custom-maps/abc.png')
 * // => 'https://img.skatekrak.com/_/plain/maps/custom-maps/abc.png'
 *
 * // With resize + format
 * getImgproxyUrl('https://img.skatekrak.com', 'maps/custom-maps/abc.png', {
 *     width: 300,
 *     height: 200,
 *     resizingType: 'fill',
 *     format: 'webp',
 * })
 * // => 'https://img.skatekrak.com/_/rs:fill:300:200/f:webp/plain/maps/custom-maps/abc.png'
 * ```
 */
export function getImgproxyUrl(baseUrl: string, path: string, options?: ImgproxyOptions): string {
    const base = baseUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');

    const parts: string[] = [];

    if (options) {
        if (options.resizingType || options.width || options.height || options.enlarge) {
            const rs = [
                'rs',
                options.resizingType ?? 'fit',
                options.width ?? 0,
                options.height ?? 0,
                options.enlarge ? 1 : 0,
            ];
            parts.push(rs.join(':'));
        }

        if (options.gravity) {
            parts.push(`g:${options.gravity}`);
        }

        if (options.dpr && options.dpr !== 1) {
            parts.push(`dpr:${options.dpr}`);
        }

        if (options.quality) {
            parts.push(`q:${options.quality}`);
        }

        if (options.blur) {
            parts.push(`bl:${options.blur}`);
        }

        if (options.format) {
            parts.push(`f:${options.format}`);
        }
    }

    const processingOptions = parts.length > 0 ? parts.join('/') + '/' : '';

    return `${base}/_/${processingOptions}plain/${cleanPath}`;
}
