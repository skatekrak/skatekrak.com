// import Overlay from 'pigeon-overlay';
import React from 'react';

import { Spot } from 'carrelage';
import { Marker } from 'react-map-gl';

type Props = {
    spot: Spot;
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
                >
                    {spot.name}
                </div>
            </Marker>
        );
    }
}

export default SpotMarker;
