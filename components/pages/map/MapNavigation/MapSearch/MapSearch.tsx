import React, { useCallback, useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import SearchIcon from 'components/Ui/Icons/Search';
import IconClear from 'components/Ui/Icons/IconClear';
import MapSearchResults from './MapSearchResults/MapSearchResults';
import { SpotHit, spotIndex, SpotSearchResult } from 'lib/algolia';
import { RootState } from 'store';
import { toggleSearchResult } from 'store/map/slice';

import * as S from './MapSearch.styled';

const fetchSpots = async (query: string): Promise<SpotHit[]> => {
    const res = await spotIndex.search<SpotSearchResult>(query, { hitsPerPage: 20 });
    return res.hits;
};

const MapNavigation = () => {
    const [searchValue, setSearchValue] = useState('');
    const searchResultOpen = useSelector((state: RootState) => state.map.searchResultOpen);
    const dispatch = useDispatch();

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

    const updateSearchResultVisibility = useCallback(
        (open: boolean) => {
            dispatch(toggleSearchResult(open));
        },
        [dispatch],
    );

    return (
        <S.MapSearchContainer>
            <S.MapSearchBar>
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
            </S.MapSearchBar>
            {searchValue !== '' && searchResultOpen && (
                <MapSearchResults
                    places={places ?? []}
                    spots={spots ?? []}
                    loading={isLoading}
                    onClick={() => updateSearchResultVisibility(false)}
                />
            )}
        </S.MapSearchContainer>
    );
};

export default React.memo(MapNavigation);
