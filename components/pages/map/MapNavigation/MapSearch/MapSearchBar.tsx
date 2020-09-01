import React, { useState } from 'react';
import SearchIcon from 'components/Ui/Icons/Search';
import ClearIcon from 'components/Ui/Icons/Clear';

type Props = {
    searchValue: string;
    handleSearchChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearchValue: () => void;
};

const MapSearchBar = ({ searchValue, handleSearchChange, clearSearchValue }: Props) => {
    return (
        <div id="map-navigation-search-bar">
            <input
                id="map-navigation-search-bar-input"
                type="text"
                placeholder="Find a spot"
                value={searchValue}
                onChange={handleSearchChange}
                autoComplete="off"
            />
            {searchValue.length === 0 ? (
                <SearchIcon />
            ) : (
                <button onClick={clearSearchValue}>
                    <ClearIcon />
                </button>
            )}
        </div>
    );
};

export default React.memo(MapSearchBar);
