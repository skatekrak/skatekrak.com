import React, { useState } from 'react';

import MapSearchBar from './MapSearchBar';
import MapSearchResults from './MapSearchResults/MapSearchResults';

const index = () => {
    const [searchValue, setSearchValue] = useState('');

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
            {searchValue.length !== 0 && <MapSearchResults />}
        </div>
    );
};

export default index;
