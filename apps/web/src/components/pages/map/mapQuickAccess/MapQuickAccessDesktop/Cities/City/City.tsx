import React from 'react';
import { useDispatch } from 'react-redux';

import * as S from './City.styled';

import { City } from '@/lib/map/types';
import { toggleLegend, toggleSearchResult } from '@/store/map/slice';
import { useMap } from 'react-map-gl';
import { centerFromBounds } from '@/lib/map/helpers';
import { useCustomMapID, useSpotID, useSpotModal } from '@/lib/hook/queryState';

type CityProps = {
    city: City;
    onCityClick: () => void;
};

const CityComponent: React.FC<CityProps> = ({ city, onCityClick }) => {
    const dispatch = useDispatch();
    const { current: map } = useMap();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();
    const [, setCustomMapID] = useCustomMapID();

    const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onCityClick();
        dispatch(toggleLegend(false));
        dispatch(toggleSearchResult(false));
        setSpotID(null);
        setModalVisible(null);
        setCustomMapID(null);

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
    };
    return (
        <S.City onClick={onClick}>
            <S.CityImage
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}.jpg')`,
                }}
            />
            <S.CityName component="subtitle2" truncateLines={1}>
                {city.name}
            </S.CityName>
        </S.City>
    );
};

export default React.memo(CityComponent);
