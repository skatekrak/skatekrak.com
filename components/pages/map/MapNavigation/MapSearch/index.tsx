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

const index = () => {
    const [searchValue, setSearchValue] = useState('');

    const debouncedSpotsSearch = useConstant(() => AwesomeDebouncePromise(querySpotsSearch, 200));
    const { isLoading: spotSearchLoading, data: spots } = useQuery(
        ['search-spots', { query: searchValue }],
        (key, { query }) => {
            if (!query) {
                return null;
            }
            return debouncedSpotsSearch({ query });
        },
        { refetchOnWindowFocus: false },
    );

    const debouncedPlacesSearch = useConstant(() => AwesomeDebouncePromise(fetchPlaces, 200));
    const { isLoading: placeSearchLoading, data: places } = useQuery(
        ['search-places', { query: searchValue }],
        (key, { query }) => {
            if (!query) {
                return null;
            }
            return debouncedPlacesSearch(query);
        },
        { refetchOnWindowFocus: false },
    );

    const isLoading = spotSearchLoading && placeSearchLoading;

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

export default index;
