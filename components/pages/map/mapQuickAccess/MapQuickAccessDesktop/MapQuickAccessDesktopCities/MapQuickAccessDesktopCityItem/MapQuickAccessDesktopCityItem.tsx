import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as S from '../MapQuickAccessDesktopCities.styled';

import { City } from 'map';
import { toggleLegend, toggleSearchResult } from 'store/map/slice';
import { flyTo, updateUrlParams } from 'store/map/slice';

type MapQuickAccessDesktopCityItemProps = {
    city: City;
    onCitiesClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessDesktopCityItem: React.FC<MapQuickAccessDesktopCityItemProps> = ({ city, onCitiesClick }) => {
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
            dispatch(flyTo({ bounds: city.bounds, padding: 0 }));
        },
        [onCitiesClick, dispatch, city.bounds],
    );

    return (
        <S.MapQuickAccessDesktopCityItem onClick={onClick}>
            <S.MapQuickAccessDesktopCityItemImage
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}@3x.jpg')`,
                }}
            />
            <S.MapQuickAccessDesktopCityItemName component="subtitle2" truncateLines={1}>
                {city.name}
            </S.MapQuickAccessDesktopCityItemName>
        </S.MapQuickAccessDesktopCityItem>
    );
};

export default React.memo(MapQuickAccessDesktopCityItem);
