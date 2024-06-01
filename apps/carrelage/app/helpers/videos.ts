import got from 'got';
import httpStatus from 'http-status';

import config from '../server/config';
import logger from '../server/logger';
import APIError from './api-error';

import { Providers } from '../models/clip';

/**
 * Some helpers function to parse video information from Youtube or Vimeo
 */

interface IVideoResponse {
    title: string;
    description: string;
    thumbnailURL: string;
    provider: Providers;
}

/**
 * Extract the ID and provider of a given url
 */
function parseVideo(url: string): { provider: Providers; id: string } {
    const match = url.match(
        /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/,
    );
    let provider;
    try {
        if (match[3].indexOf('youtu') > -1) {
            provider = Providers.Youtube;
        } else if (match[3].indexOf('vimeo') > -1) {
            provider = Providers.Vimeo;
        }
    } catch (error) {
        throw new APIError(['url not valid'], httpStatus.BAD_REQUEST, error);
    }
    return {
        provider,
        id: match[6],
    };
}

/**
 * Get an url for the thumbnail, standard -> high -> medium -> low
 */
function ytThumbnailUrl(thumbnails: any): string {
    if (thumbnails.standard) {
        return thumbnails.standard.url;
    }
    if (thumbnails.high) {
        return thumbnails.high.url;
    }
    if (thumbnails.medium) {
        return thumbnails.medium.url;
    }
    return thumbnails.default.url;
}

/**
 * Fill the clip with informations from Youtube
 */
function youtube(videoInfo: { id: string }): Promise<IVideoResponse> {
    return got('https://www.googleapis.com/youtube/v3/videos', {
        query: {
            id: videoInfo.id,
            key: config.GOOGLE_KEY,
            part: 'snippet,contentDetails',
            maxResults: 50,
        },
        json: true,
    }).then((response) => {
        const item = response.body.items[0];
        return {
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailURL: ytThumbnailUrl(item.snippet.thumbnails),
            provider: Providers.Youtube,
        };
    });
}

/**
 * Get 10 last videos from Krak Youtube channel
 */
async function getKrakYTFeed() {
    const { body: feed } = await got('https://www.googleapis.com/youtube/v3/search', {
        query: {
            channelId: 'UC1o-dFTrXKLa6Ov8GiysF7g',
            key: config.GOOGLE_KEY,
            part: 'snippet',
            order: 'date',
            maxResults: 10,
        },
        json: true,
    });
    const res = [];
    for (const item of feed.items) {
        res.push({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: ytThumbnailUrl(item.snippet.thumbnails),
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        });
    }
    return res;
}

/**
 * Fill the clip with informations from Vimeo
 */
function vimeo(videoInfo: { id: string }): Promise<IVideoResponse> {
    return got(`https://api.vimeo.com/videos/${videoInfo.id}`, {
        headers: {
            Authorization: `Bearer ${config.VIMEO_AUTH}`,
        },
        json: true,
    }).then((response) => ({
        title: response.body.name,
        description: response.body.description,
        thumbnailURL: response.body.pictures.sizes[3].link_with_play_button,
        provider: Providers.Vimeo,
    }));
}

/**
 * Get youtube or vimeo video informations from the url
 */
async function getVideoInformation(videoURL: string): Promise<IVideoResponse> {
    const videoInfo = parseVideo(videoURL);
    logger.debug('Video info', videoInfo);

    if (config.NODE_ENV !== 'development') {
        switch (videoInfo.provider) {
            case Providers.Youtube:
                return await youtube(videoInfo);
            case Providers.Vimeo:
                return await vimeo(videoInfo);
            default:
                return null;
        }
    }

    switch (videoInfo.provider) {
        case Providers.Youtube:
            return await Promise.resolve({
                title: 'KrakBox unboxing - Best Of #4',
                description: "If you don't wanna miss one (and be part of the krak family) check out our KrakBox",
                thumbnailURL: 'https://i.ytimg.com/vi/cdghhu3Yj8A/sddefault.jpg',
                provider: Providers.Youtube,
            });
        case Providers.Vimeo:
            return await Promise.resolve({
                title: 'ZAP.02',
                description: 'Nice vimeo description',
                thumbnailURL:
                    'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F576954873_640x480.jpg&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png',
                provider: Providers.Vimeo,
            });
        default:
            return null;
    }
}

export default { parseVideo, getVideoInformation, getKrakYTFeed };
