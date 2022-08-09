import { useQuery } from '@tanstack/react-query';
import Feudartifice from '..';

export const useVideoInformation = (url: string) => {
    return useQuery(
        ['fetch-video-info', url],
        async () => {
            return Feudartifice.clips.fetchVideoInformation(url);
        },
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
            enabled: url !== '',
        },
    );
};
