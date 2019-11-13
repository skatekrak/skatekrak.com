// import Overlay from 'pigeon-overlay';
import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { Marker } from 'react-map-gl';

import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconStreet from 'components/pages/map/marker/icons/Street';

type Props = {
    spot: Spot;
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    fitBounds: (b1: [number, number], b2: [number, number]) => void;
};

class SpotMarker extends React.Component<Props> {
    public render() {
        const { spot } = this.props;
        // console.log(spot);
        return (
            <Marker
                latitude={spot.location.latitude}
                longitude={spot.location.longitude}
                offsetLeft={-24}
                offsetTop={-24}
            >
                <button className="map-marker" onClick={this.onMarkerClick}>
                    <div className="map-marker-icon">
                        {spot.type === 'street' && <IconStreet />}
                        {spot.type === 'park' && <IconPark />}
                        {spot.type === 'shop' && <IconShop />}
                        {spot.type === 'private' && <IconPrivate />}
                        {spot.type === 'diy' && <IconDiy />}
                    </div>
                    <div className="map-marker-badges">
                        <span />
                    </div>
                </button>
            </Marker>
        );
    }

    private onMarkerClick = () => {
        console.log('clicked!');
    };
}

export default SpotMarker;
