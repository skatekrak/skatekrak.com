import { AxiosError } from 'axios';
import { QueryFunctionContext, useQuery } from 'react-query';

import { boxSearchSpots, BoxSearchResult, BoxSearchType } from '../spots';

const useSpots = <T extends BoxSearchType>(params: T) => {
    return useQuery<BoxSearchResult<T>, AxiosError<any>>(
        ['box-search-spots', params],
        () => {
            return boxSearchSpots(params);
        },
        { enabled: params.northEastLatitude != null, keepPreviousData: true },
    );
};

export default useSpots;