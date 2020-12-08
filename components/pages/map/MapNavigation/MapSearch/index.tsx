import React, { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from 'react-query';
import axios from 'axios';

import MapSearchBar from './MapSearchBar';
import MapSearchResults from './MapSearchResults/MapSearchResults';
import { SpotHit, spotIndex, SpotSearchResult } from 'lib/algolia';
import { Place } from 'lib/placeApi';

const fetchPlaces = async (query: string): Promise<Place[]> => {
    const res = await axios.get('/api/place-search', { params: { input: query } });
    return res.data;
};

const fetchSpots = async (query: string): Promise<SpotHit[]> => {
    const res = await spotIndex.search<SpotSearchResult>(query, { hitsPerPage: 20 });
    return res.hits;
};

const MapNavigation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchFieldFocus, setSearchFieldFocus] = useState(false);

    const debouncedSpotsSearch = useConstant(() =>
        AwesomeDebouncePromise((query: string) => Promise.all([fetchSpots(query), fetchPlaces(query)]), 200),
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
                onFocus={setSearchFieldFocus}
            />
            {searchFieldFocus && (
                <MapSearchResults
                    hasValue={searchValue !== ''}
                    places={places ?? []}
                    spots={spots ?? []}
                    loading={isLoading}
                />
            )}
        </div>
    );
};

export default React.memo(MapNavigation);
