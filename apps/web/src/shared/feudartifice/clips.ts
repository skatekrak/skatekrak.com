import client from './client';
import { Clip, VideoInformation } from './types';

export const fetchVideoInformation = async (url: string) => {
    const res = await client.get<VideoInformation>('/clips/information', {
        params: {
            url,
        },
    });

    return res.data;
};

export const addClip = async (spotId: string, videoURL: string) => {
    const res = await client.post<Clip>('/clips', {
        spot: spotId,
        url: videoURL,
    });

    return res.data;
};
