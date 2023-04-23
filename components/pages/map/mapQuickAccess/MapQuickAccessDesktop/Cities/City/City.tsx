import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import * as S from './City.styled';

import { City } from 'map';
import { toggleLegend, toggleSearchResult } from 'store/map/slice';
import { updateUrlParams } from 'store/map/slice';
import { useMap } from 'react-map-gl';
import { centerFromBounds } from 'lib/map/helpers';

type CityProps = {
    city: City;
    onCityClick: () => void;
};

const CityComponent: React.FC<CityProps> = ({ city, onCityClick }) => {
    const dispatch = useDispatch();
    const { current: map } = useMap();

    const onClick = useCallback(
        (e: React.SyntheticEvent) => {
            e.preventDefault();
            onCityClick();
            dispatch(toggleLegend(false));
            dispatch(toggleSearchResult(false));
            dispatch(
                updateUrlParams({
                    spotId: null,
                    modal: false,
                    customMapId: null,
                }),
            );

            const cityCenter = centerFromBounds(city.bounds);
            map?.flyTo({
                center: {
                    lat: cityCenter.latitude,
                    lng: cityCenter.longitude,
                },
                padding: 0,
                duration: 1500,
                zoom: 11.7,
            });
        },
        [onCityClick, dispatch, city.bounds, map],
    );

    return (
        <S.City onClick={onClick}>
            <S.CityImage
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}@3x.jpg')`,
                }}
            />
            <S.CityName component="subtitle2" truncateLines={1}>
                {city.name}
            </S.CityName>
        </S.City>
    );
};

export default React.memo(CityComponent);
