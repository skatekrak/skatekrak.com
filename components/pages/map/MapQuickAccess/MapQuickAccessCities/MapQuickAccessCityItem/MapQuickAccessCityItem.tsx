import { City } from 'map';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLegend, toggleSearchResult } from 'store/map/actions';
import { flyTo, updateUrlParams } from 'store/map/thunk';

type MapQuickAccessCityItemProps = {
    city: City;
    onCitiesClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessCityItem: React.FC<MapQuickAccessCityItemProps> = ({ city, onCitiesClick }) => {
    const dispatch = useDispatch();

    const onClick = useCallback(
        (e: React.SyntheticEvent) => {
            e.preventDefault();
            onCitiesClick(e);
            dispatch(toggleLegend(false));
            dispatch(toggleSearchResult(false));
            dispatch(
                updateUrlParams({
                    spotId: null,
                    modal: false,
                    customMapId: null,
                }),
            );
            dispatch(flyTo(city.bounds, 0));
        },
        [onCitiesClick, dispatch, city.bounds],
    );

    return (
        <button className="map-quick-access-city-item" onClick={onClick}>
            <div
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}@3x.png')`,
                }}
                className="map-quick-access-city-item-image"
            />
            <p className="map-quick-access-city-item-name">{city.name}</p>
        </button>
    );
};

export default React.memo(MapQuickAccessCityItem);
