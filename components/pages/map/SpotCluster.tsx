import React from 'react';

import { Cluster } from 'carrelage';
import { Marker } from 'react-map-gl';

type Props = {
    cluster: Cluster;
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
                >
                    {cluster.count}
                </div>
            </Marker>
        );
    }
}

export default SpotCluster;
