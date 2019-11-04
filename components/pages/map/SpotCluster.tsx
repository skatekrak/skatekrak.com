import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { InteractiveMap, Marker } from 'react-map-gl';
type Props = {
    cluster: Cluster;
    fitBounds: (b1: [number, number], b2: [number, number]) => void;
};

class SpotCluster extends React.Component<Props> {
    public render() {
        const { cluster } = this.props;
        return (
            <Marker latitude={cluster.latitude} longitude={cluster.longitude}>
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
                    {cluster.count}
                </div>
            </Marker>
        );
    }

    private onClick = () => {
        const cluster = this.props.cluster;
        this.props.fitBounds([cluster.minLongitude, cluster.minLatitude], [cluster.maxLongitude, cluster.maxLatitude]);
    };
}

export default SpotCluster;
