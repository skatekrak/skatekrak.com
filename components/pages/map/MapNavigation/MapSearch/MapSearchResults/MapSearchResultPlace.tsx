import React from 'react';

import DiyIcon from 'components/pages/map/marker/icons/Diy';

type Props = {
    place: any;
    onPlaceClick: (place) => void;
};

const MapSearchResultSpot = ({ place, onPlaceClick }: Props) => {
    const handlePlaceClick = () => {
        onPlaceClick(place);
    };

    return (
        <>
            <button className="map-navigation-search-result-spot" onClick={handlePlaceClick}>
                <div className="map-navigation-search-result-spot-icon">
                    <DiyIcon />
                </div>
                <div className="map-navigation-search-result-spot-container-start">
                    <p className="map-navigation-search-result-place-name">{place.name}</p>
                </div>
            </button>
            <div className="map-navigation-search-result-spot-divider" />
        </>
    );
};

export default MapSearchResultSpot;
