// import Overlay from 'pigeon-overlay';
import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { Marker } from 'react-map-gl';

type Props = {
    spot: Spot;
    fitBounds: (b1: [number, number], b2: [number, number]) => void;
};

class SpotMarker extends React.Component<Props> {
    public render() {
        const { spot } = this.props;
        return (
            <Marker latitude={spot.location.latitude} longitude={spot.location.longitude}>
                <div
                    style={{
                        height: '2rem',
                        width: '2rem',
                        backgroundColor: '#bbb',
                        borderRadius: '50%',
                        display: 'inline-block',
                        textAlign: 'center',
                    }}
                    onClick={this.onClick}
                >
                    {spot.name}
                </div>
            </Marker>
        );
    }

    private onClick = () => {
        console.log('Click');
    };
}

export default SpotMarker;
