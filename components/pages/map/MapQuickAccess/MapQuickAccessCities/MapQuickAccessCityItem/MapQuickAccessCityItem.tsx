import React from 'react';

type MapQuickAccessCityItemProps = {
    city: any;
};

const MapQuickAccessCityItem: React.FC<MapQuickAccessCityItemProps> = ({ city }) => {
    return (
        <button className="map-quick-access-city-item">
            <div
                style={{
                    backgroundImage: `url('${city.photoUrl}')`,
                }}
                className="map-quick-access-city-item-image"
            />
            <p className="map-quick-access-city-item-name">{city.name}</p>
        </button>
    );
};

export default MapQuickAccessCityItem;
