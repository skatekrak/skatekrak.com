import React from 'react';

import { Cluster } from 'lib/carrelageClient';
import { Marker } from 'react-map-gl';

type SpotClusterProps = {
    cluster: Cluster;
    viewportZoom: number;
};

const SpotCluster = ({ cluster, viewportZoom }: SpotClusterProps) => {
    let opacity = 0.2;
    let size = 10;

    if (viewportZoom < 5.5) {
        if (cluster.count >= 2) {
            size = 16;
        }

        if (cluster.count >= 15) {
            opacity = 0.6;
            size = 18;
        }
    }

    if (viewportZoom >= 5.5) {
        opacity = 0.2;
        size = 12;

        if (cluster.count >= 2) {
            opacity = 0.3;
            size = 20;
        }

        if (cluster.count >= 10) {
            opacity = 0.5;
            size = 32;
        }
    }

    if (viewportZoom >= 8) {
        opacity = 0.3;
        size = 20;

        if (cluster.count >= 7) {
            opacity = 0.4;
            size = 32;
        }
    }

    if (viewportZoom >= 10) {
        opacity = 0.4;
        size = 20;

        if (cluster.count >= 4) {
            opacity = 0.8;
            size = 32;
        }
    }

    if (viewportZoom >= 11.5) {
        opacity = 0.5;
        size = 24;

        if (cluster.count >= 3) {
            opacity = 0.8;
            size = 32;
        }
    }

    return (
        <Marker
            key={cluster.id}
            latitude={cluster.latitude}
            longitude={cluster.longitude}
            offset={[-(size / 2), -(size / 2)]}
        >
            <div
                style={{
                    height: `${size}px`,
                    width: `${size}px`,
                    background: 'radial-gradient(50% 50% at 50% 50%, #F42B25 0%, rgba(153, 54, 51, 0) 100%)',
                    borderRadius: '50%',
                    opacity,
                }}
            />
        </Marker>
    );
};

export default React.memo(SpotCluster);
