import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { InteractiveMap, Marker } from 'react-map-gl';
type Props = {
    cluster: Cluster;
    pixelsPerDegree: [number, number, number];
    fitBounds: (b1: [number, number], b2: [number, number]) => void;
};

class SpotCluster extends React.Component<Props> {
    public render() {
        const { cluster } = this.props;

        const radius = this.getClusterRadius();

        return (
            <Marker
                latitude={cluster.latitude}
                longitude={cluster.longitude}
                offsetLeft={-radius / 2}
                offsetTop={-radius / 2}
            >
                <div
                    style={{
                        height: `${radius}px`,
                        width: `${radius}px`,
                        backgroundColor: 'rgba(4, 119, 234, 0.5)',
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

    private getClusterRadius = (): number => {
        const cluster = this.props.cluster;

        const latDeg = Math.abs(cluster.minLatitude - cluster.maxLatitude);
        const lngDeg = Math.abs(cluster.minLongitude - cluster.maxLongitude);

        const [lngPxPerDeg, latPxPerDeg] = this.props.pixelsPerDegree;

        return Math.max(lngDeg * lngPxPerDeg, latDeg * latPxPerDeg, 30);
    };

    private onClick = () => {
        const cluster = this.props.cluster;
        this.props.fitBounds([cluster.minLongitude, cluster.minLatitude], [cluster.maxLongitude, cluster.maxLatitude]);
    };
}

export default SpotCluster;
