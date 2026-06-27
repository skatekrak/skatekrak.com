import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import IconClear from '@/components/Ui/Icons/IconClear';
import SearchIcon from '@/components/Ui/Icons/Search';
import { useCombinedSearch } from '@/lib/hook/useMapSearch';
import { useMapStore } from '@/store/map';

import MapSearchResults from './MapSearchResults/MapSearchResults';

const MapNavigation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResultOpen, toggleSearchResult] = useMapStore(
        useShallow((state) => [state.searchResultIsOpen, state.toggleSearchResult]),
    );

    const { results, isLoading } = useCombinedSearch(searchValue);

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
        <div className="grow relative flex flex-col z-1">
            <div className="flex items-center p-4 bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp [&_input]:w-full [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-inherit [&_input]:outline-none [&_input_placeholder]:text-onDark-mediumEmphasis [&_button]:flex [&_button]:ml-4 [&_svg]:shrink-0 [&_svg]:w-6! [&_svg]:fill-onDark-lowEmphasis">
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
                    results={results}
                    loading={isLoading}
                    onClick={() => updateSearchResultVisibility(false)}
                />
            )}
        </div>
    );
};

export default React.memo(MapNavigation);
