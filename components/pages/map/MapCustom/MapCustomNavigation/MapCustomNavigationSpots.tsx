import React, { useState } from 'react';

import Scrollbar from 'components/Ui/Scrollbar';
import IconSearch from 'components/Ui/Icons/Search';
import IconClear from 'components/Ui/Icons/Clear';

import MapSearchResultLoading from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultLoading';
import MapSearchResultNoContent from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultNoContent';
import MapSearchResultSpot from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import MapSearchResultPlace from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultPlace';

import { Spot } from 'lib/carrelageClient';

const places = [];

type Props = {
    mapSpots: any;
};

const MapCustomNavigationSpots = ({ mapSpots }: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearchSpotsLoading, setIsSearchSpotsLoading] = useState(false);

    const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(evt.target.value);
    };

    const clearSearchValue = () => {
        setSearchValue('');
    };

    const onSpotClick = () => console.log('spot clicked');
    const onPlaceClick = () => console.log('place clicked');

    return (
        <div id="custom-map-navigation-extension-spots">
            {/* <div id="custom-map-navigation-extension-spots-search">
                <input
                    id="custom-map-navigation-extension-spots-search-input"
                    type="text"
                    placeholder="Search into the list"
                    value={searchValue}
                    onChange={handleSearchChange}
                    autoComplete="off"
                />
                {searchValue.length === 0 ? (
                    <IconSearch />
                ) : (
                    <button onClick={clearSearchValue}>
                        <IconClear />
                    </button>
                )}
            </div> */}
            <div id="custom-map-navigation-extension-spots-results">
                <Scrollbar maxHeight="22.25rem">
                    {isSearchSpotsLoading ? (
                        <MapSearchResultLoading />
                    ) : (
                        <>
                            {mapSpots.length === 0 ? (
                                <MapSearchResultNoContent />
                            ) : (
                                <>
                                    {places.map((place) => (
                                        <MapSearchResultPlace
                                            key={place.id}
                                            place={place}
                                            onPlaceClick={onPlaceClick}
                                        />
                                    ))}
                                    {mapSpots.map((spot: Spot) => (
                                        <MapSearchResultSpot key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Scrollbar>
            </div>
        </div>
    );
};

export default MapCustomNavigationSpots;
