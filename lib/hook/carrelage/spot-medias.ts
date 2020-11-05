import queryString from 'query-string';
import carrelage from 'lib/carrelageClient';
import { useInfiniteQuery } from 'react-query';
import { Media } from 'lib/carrelageClient';

const fetchMedias = async (key: string, cursor: any = new Date()) => {
    const params = queryString.parse(key);
    const { data } = await carrelage.get<Media[]>(`/spots/${params.spotId}/medias`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

const useSpotMedias = (spotId: string, initialMedias: Media[]) => {
    return useInfiniteQuery(queryString.stringify({ spotId, key: 'fetch-spot-medias' }), fetchMedias, {
        getFetchMore: (lastPage) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return false;
        },
        initialData: [initialMedias],
        refetchOnWindowFocus: false,
    });
};

export default useSpotMedias;
