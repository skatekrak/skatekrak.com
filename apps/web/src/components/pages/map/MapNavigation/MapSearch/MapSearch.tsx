import React, { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import SearchIcon from '@/components/Ui/Icons/Search';
import IconClear from '@/components/Ui/Icons/IconClear';
import MapSearchResults from './MapSearchResults/MapSearchResults';
import { SpotHit, spotIndex, SpotSearchResult } from '@/lib/meilisearch';
import { useMapStore } from '@/store/map';

const fetchSpots = async (query: string): Promise<SpotHit[]> => {
    const res = await spotIndex.search<SpotSearchResult>(query, { hitsPerPage: 20 });
    return res.hits;
};

const MapNavigation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResultOpen, toggleSearchResult] = useMapStore(
        useShallow((state) => [state.searchResultIsOpen, state.toggleSearchResult]),
    );

    const debouncedSpotsSearch = useConstant(() =>
        AwesomeDebouncePromise((query: string) => Promise.all([fetchSpots(query)]), 200),
    );
    const { isLoading, data } = useQuery({
        queryKey: ['search-spots', searchValue],
        queryFn: () => {
            if (!searchValue) {
                return null;
            }
            return debouncedSpotsSearch(searchValue);
        },
        refetchOnWindowFocus: false,
    });

    const [spots, places] = data ?? [[], []];

    const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(evt.target.value);
    };

    const clearSearchValue = () => {
        setSearchValue('');
    };

    const updateSearchResultVisibility = (open: boolean) => {
        toggleSearchResult(open);
    };

    return (
        <div className="grow relative flex flex-col z-[1]">
            <div className="flex items-center p-4 bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp [&_input]:w-full [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-inherit [&_input]:outline-none [&_input_placeholder]:text-onDark-mediumEmphasis [&_button]:flex [&_button]:ml-4 [&_svg]:shrink-0 [&_svg]:!w-6 [&_svg]:fill-onDark-lowEmphasis">
                <input
                    type="text"
                    placeholder="Find a spot"
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoComplete="off"
                    onFocus={() => updateSearchResultVisibility(true)}
                />
                {searchValue.length === 0 ? (
                    <SearchIcon />
                ) : (
                    <button onClick={clearSearchValue}>
                        <IconClear />
                    </button>
                )}
            </div>
            {searchValue !== '' && searchResultOpen && (
                <MapSearchResults
                    places={places ?? []}
                    spots={spots ?? []}
                    loading={isLoading}
                    onClick={() => updateSearchResultVisibility(false)}
                />
            )}
        </div>
    );
};

export default React.memo(MapNavigation);
