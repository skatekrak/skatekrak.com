import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import Typography from '@/components/Ui/typography/Typography';
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
        <button
            onClick={onClick}
            className="flex flex-col items-center w-20 mx-auto p-2 text-onDark-highEmphasis border-0"
        >
            <div
                className="w-14 h-14 bg-tertiary-medium bg-cover bg-center border-2 border-solid border-tertiary-light rounded-full"
                style={{
                    backgroundImage: `url('/images/map/cities/${city.id}.jpg')`,
                }}
            />
            <Typography component="subtitle2" truncateLines={1} className="w-full mt-1">
                {city.smallName ?? city.name}
            </Typography>
        </button>
    );
};

export default React.memo(CityComponent);
