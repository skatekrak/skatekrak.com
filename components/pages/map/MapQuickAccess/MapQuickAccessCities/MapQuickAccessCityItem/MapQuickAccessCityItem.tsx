import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as S from '../MapQuickAccessCities.styled';

import { City } from 'map';
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
        <S.MapQuickAccessCityItem onClick={onClick}>
            <S.MapQuickAccessCityItemImage
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}@3x.jpg')`,
                }}
            />
            <S.MapQuickAccessCityItemName component="subtitle2" truncateLines={1}>
                {city.name}
            </S.MapQuickAccessCityItemName>
        </S.MapQuickAccessCityItem>
    );
};

export default React.memo(MapQuickAccessCityItem);
