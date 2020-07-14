import React, { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from 'react-query';

import { querySpotsSearch } from 'lib/carrelageClient';
import MapSearchBar from './MapSearchBar';
import MapSearchResults from './MapSearchResults/MapSearchResults';

const index = () => {
    const [searchValue, setSearchValue] = useState('');

    const debouncedSearch = useConstant(() => AwesomeDebouncePromise(querySpotsSearch, 200));
    const { isLoading, data } = useQuery(
        ['search-spots', { query: searchValue }],
        (key, { query }) => {
            if (!query) {
                return null;
            }
            return debouncedSearch({ query });
        },
        { refetchOnWindowFocus: false },
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
            {searchValue.length !== 0 && <MapSearchResults spots={data ?? []} loading={isLoading} />}
        </div>
    );
};

export default index;
