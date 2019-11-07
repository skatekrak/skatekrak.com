// import Overlay from 'pigeon-overlay';
import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { Marker } from 'react-map-gl';

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
        return (
            <Marker
                latitude={spot.location.latitude}
                longitude={spot.location.longitude}
                offsetLeft={-24}
                offsetTop={-24}
            >
                <img
                    src={`/images/map/icons/${spot.type}.svg`}
                    alt="Street spot icon"
                    style={{
                        height: '48px',
                        width: '48px',
                        display: 'inline-block',
                    }}
                    onClick={this.onClick}
                />
            </Marker>
        );
    }

    private onClick = () => {
        console.log('Click');
    };
}

export default SpotMarker;
