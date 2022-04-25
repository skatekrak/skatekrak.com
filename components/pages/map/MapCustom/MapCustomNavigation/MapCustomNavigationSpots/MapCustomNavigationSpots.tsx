import React from 'react';
import { FlyToInterpolator, ViewportProps } from 'react-map-gl';

import Scrollbar from 'components/Ui/Scrollbar';
import MapSearchResultSpot from '../../../MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';

import { Spot } from 'lib/carrelageClient';
import { useDispatch } from 'react-redux';
import { selectSpot, setViewport } from 'store/map/actions';

type Props = {
    mapSpots: any;
    closeExtension: () => void;
};

const MapCustomNavigationSpots = ({ mapSpots, closeExtension }: Props) => {
    const dispatch = useDispatch();

    const onSpotClick = (spot: Spot) => {
        const viewport: Partial<ViewportProps> = {
            latitude: spot.location.latitude,
            longitude: spot.location.longitude,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
        };

        closeExtension();
        dispatch(setViewport(viewport));
        dispatch(selectSpot(spot.id));
    };

    return (
        <Scrollbar maxHeight="22.25rem">
            <>
                {mapSpots.map((spot: Spot) => (
                    <MapSearchResultSpot<Spot> key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                ))}
            </>
        </Scrollbar>
    );
};

export default React.memo(MapCustomNavigationSpots);
