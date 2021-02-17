import queryString from 'query-string';
import carrelage, { Clip } from 'lib/carrelageClient';
import { useInfiniteQuery } from 'react-query';

const fetchClips = async (key: string, cursor: any = new Date()) => {
    const params = queryString.parse(key);
    const { data } = await carrelage.get<Clip[]>(`/spots/${params.spotId}/clips`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

const useSpotClips = (spotId: string, initialClips: Clip[]) => {
    return useInfiniteQuery(queryString.stringify({ spotId, key: 'fetch-spot-clips' }), fetchClips, {
        getFetchMore: (lastPage) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return false;
        },
        initialData: [initialClips],
        refetchOnWindowFocus: false,
    });
};

export default useSpotClips;
