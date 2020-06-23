import React, { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useSWR from 'swr';

import { querySpotsSearch, QuerySearchSpotsParam } from 'lib/carrelageClient';
import MapSearchBar from './MapSearchBar';
import MapSearchResults from './MapSearchResults/MapSearchResults';

const index = () => {
    const [searchValue, setSearchValue] = useState('');

    const debouncedSearch = useConstant(() => AwesomeDebouncePromise(querySpotsSearch, 200));
    const { data, isValidating } = useSWR(
        searchValue.length === 0 ? null : ['spots-search', searchValue],
        (key, value) => {
            const param: QuerySearchSpotsParam = { query: value };
            return debouncedSearch(param);
        },
        {
            revalidateOnFocus: false,
        },
    );

    const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(evt.target.value);
    };

    const clearSearchValue = () => {
        setSearchValue('');
    };

    return (
        <div>
            <MapSearchBar
                searchValue={searchValue}
                handleSearchChange={handleSearchChange}
                clearSearchValue={clearSearchValue}
            />
            {searchValue.length !== 0 && <MapSearchResults spots={data ?? []} loading={isValidating} />}
        </div>
    );
};

export default index;
