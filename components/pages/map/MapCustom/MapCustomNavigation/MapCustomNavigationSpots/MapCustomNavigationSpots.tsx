import React from 'react';
import { useMap } from 'react-map-gl';

import Scrollbar from 'components/Ui/Scrollbar';
import MapSearchResultSpot from '../../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';

import { Spot } from 'lib/carrelageClient';
import { useDispatch } from 'react-redux';
import { selectSpot } from 'store/map/slice';

type Props = {
    mapSpots: any;
    closeExtension: () => void;
};

const MapCustomNavigationSpots = ({ mapSpots, closeExtension }: Props) => {
    const dispatch = useDispatch();
    const { current: map } = useMap();

    const onSpotClick = (spot: Spot) => {
        closeExtension();
        map?.flyTo({
            center: {
                lat: spot.location.latitude,
                lon: spot.location.longitude,
            },
            duration: 1000,
        });
        dispatch(selectSpot(spot.id));
    };

    return (
        <Scrollbar maxHeight="22.25rem">
            <>
                {mapSpots.map((spot: Spot) => (
                    <MapSearchResultSpot key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                ))}
            </>
        </Scrollbar>
    );
};

export default React.memo(MapCustomNavigationSpots);
