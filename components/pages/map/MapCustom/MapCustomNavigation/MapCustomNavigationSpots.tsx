import React, { useState } from 'react';

import Scrollbar from 'components/Ui/Scrollbar';

import MapSearchResultLoading from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultLoading';
import MapSearchResultNoContent from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultNoContent';
import MapSearchResultSpot from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import MapSearchResultPlace from '../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultPlace';

import { Spot } from 'lib/carrelageClient';
import { useDispatch } from 'react-redux';
import { selectSpot } from 'store/map/actions';
import { SpotHit } from 'lib/algolia';

type Props = {
    mapSpots: any;
};

const MapCustomNavigationSpots = ({ mapSpots }: Props) => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [isSearchSpotsLoading, setIsSearchSpotsLoading] = useState(false);

    const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(evt.target.value);
    };

    const clearSearchValue = () => {
        setSearchValue('');
    };

    const onSpotClick = (spot: Spot) => dispatch(selectSpot(spot.id));
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
                                    {mapSpots.map((spot: Spot) => (
                                        <MapSearchResultSpot<Spot> key={spot.id} spot={spot} onSpotClick={onSpotClick} />
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

export default React.memo(MapCustomNavigationSpots);
