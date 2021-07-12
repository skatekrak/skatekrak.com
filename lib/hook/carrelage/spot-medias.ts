import carrelage from 'lib/carrelageClient';
import { useInfiniteQuery } from 'react-query';
import { Media } from 'lib/carrelageClient';
import { AxiosError } from 'axios';

const fetchMedias = async (spotId: string, cursor: any = new Date()) => {
    const { data } = await carrelage.get<Media[]>(`/spots/${spotId}/medias`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

const useSpotMedias = (spotId: string, initialMedias: Media[]) => {
    return useInfiniteQuery<Media[], AxiosError<any>>(
        ['fetch-spot-medias', spotId],
        ({ pageParam }) => fetchMedias(spotId, pageParam),
        {
            getNextPageParam: (lastPage) => {
                const lastElement = lastPage[lastPage.length - 1];
                if (lastElement != null) {
                    return lastElement.createdAt;
                }
                return false;
            },
            initialData: {
                pages: [initialMedias],
                pageParams: initialMedias.length >= 20 ? [initialMedias[initialMedias.length - 1].createdAt] : [],
            },
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpotMedias;
