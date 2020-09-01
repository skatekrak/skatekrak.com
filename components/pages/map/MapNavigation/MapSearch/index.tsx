import React, { useState, useMemo } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from 'react-query';
import axios from 'axios';

import { querySpotsSearch } from 'lib/carrelageClient';
import MapSearchBar from './MapSearchBar';
import MapSearchResults from './MapSearchResults/MapSearchResults';
import type { Place } from 'lib/placeApi';

const fetchPlaces = async (query: string): Promise<Place[]> => {
    const res = await axios.get('/api/place-search', { params: { input: query } });
    return res.data;
};

const MapNavigation = () => {
    const [searchValue, setSearchValue] = useState('');

    const debouncedSpotsSearch = useConstant(() =>
        AwesomeDebouncePromise((query: string) => Promise.all([querySpotsSearch({ query }), fetchPlaces(query)]), 200),
    );
    const { isLoading, data } = useQuery(
        ['search-spots', { query: searchValue }],
        (key, { query }) => {
            if (!query) {
                return null;
            }
            return debouncedSpotsSearch(query);
        },
        { refetchOnWindowFocus: false },
    );

    const [spots, places] = data ?? [[], []];

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
            {searchValue.length !== 0 && (
                <MapSearchResults places={places ?? []} spots={spots ?? []} loading={isLoading} />
            )}
        </div>
    );
};

export default React.memo(MapNavigation);
