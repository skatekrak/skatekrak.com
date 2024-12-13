import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import * as S from './City.styled';

import { City } from '@/lib/map/types';
import { useMap } from 'react-map-gl';
import { centerFromBounds } from '@/lib/map/helpers';
import { useCityID, useCustomMapID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

type CityProps = {
    city: City;
    onCityClick: () => void;
};

const CityComponent: React.FC<CityProps> = ({ city, onCityClick }) => {
    const [toggleLegend, toggleSearchResult] = useMapStore(
        useShallow((state) => [state.toggleLegend, state.toggleSearchResult]),
    );
    const { current: map } = useMap();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();
    const [, setCustomMapID] = useCustomMapID();
    const [, setCityID] = useCityID();

    const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onCityClick();
        toggleLegend(false);
        toggleSearchResult(false);
        setSpotID(null);
        setModalVisible(null);
        setCustomMapID(null);
        setCityID(city.id);

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
                {city.smallName ?? city.name}
            </S.CityName>
        </S.City>
    );
};

export default React.memo(CityComponent);
