import type { z } from 'zod';
import type { VideoInformationSchema } from '@krak/contracts';
import { VideoProvider } from '@krak/carrelage-client';

import { env } from '../env';

// ============================================================================
// Types
// ============================================================================

export type VideoInformation = z.infer<typeof VideoInformationSchema>;

// ============================================================================
// URL parsing
// ============================================================================

/**
 * Extract the provider and video ID from a YouTube or Vimeo URL.
 */
export function parseVideoURL(url: string): { provider: VideoProvider; id: string } {
    const match = url.match(
        /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/,
    );

    if (!match) {
        throw new Error('URL not valid: we only support YouTube or Vimeo videos');
    }

    const host = match[3];
    if (!host) {
        throw new Error('URL not valid: could not determine video host');
    }

    const id = match[6];

    if (id) {
        if (host.includes('youtu')) {
            return { provider: VideoProvider.YOUTUBE, id };
        }
        if (host.includes('vimeo')) {
            return { provider: VideoProvider.VIMEO, id };
        }
    }

    throw new Error(`URL not valid: unsupported video host "${host}"`);
}

// ============================================================================
// Provider-specific fetchers
// ============================================================================

function pickYouTubeThumbnail(thumbnails: Record<string, { url: string }>): string {
    return thumbnails.standard?.url ?? thumbnails.high?.url ?? thumbnails.medium?.url ?? thumbnails.default?.url ?? '';
}

async function fetchYouTubeInfo(videoId: string): Promise<VideoInformation> {
    const params = new URLSearchParams({
        id: videoId,
        key: env.GOOGLE_KEY,
        part: 'snippet,contentDetails',
        maxResults: '50',
    });

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
    }

    const body = (await response.json()) as {
        items: Array<{
            snippet: {
                title: string;
                description: string;
                thumbnails: Record<string, { url: string }>;
            };
        }>;
    };

    const item = body.items[0];
    if (!item) {
        throw new Error('YouTube video not found');
    }

    return {
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailURL: pickYouTubeThumbnail(item.snippet.thumbnails),
        provider: VideoProvider.YOUTUBE,
    };
}

async function fetchVimeoInfo(videoId: string): Promise<VideoInformation> {
    const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${env.VIMEO_AUTH}` },
    });

    if (!response.ok) {
        throw new Error(`Vimeo API error: ${response.status}`);
    }

    const body = (await response.json()) as {
        name: string;
        description: string;
        pictures: { sizes: Array<{ link_with_play_button: string }> };
    };

    return {
        title: body.name,
        description: body.description ?? '',
        thumbnailURL: body.pictures.sizes[3]?.link_with_play_button ?? '',
        provider: VideoProvider.VIMEO,
    };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Parse a video URL and fetch its metadata from YouTube or Vimeo.
 */
export async function getVideoInformation(videoURL: string): Promise<VideoInformation> {
    const { provider, id } = parseVideoURL(videoURL);

    switch (provider) {
        case VideoProvider.YOUTUBE:
            return fetchYouTubeInfo(id);
        case VideoProvider.VIMEO:
            return fetchVimeoInfo(id);
    }
}
