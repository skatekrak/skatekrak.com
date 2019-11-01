import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import ReactMapGL, { ExtraState, GeolocateControl, NavigationControl, ViewportProps } from 'react-map-gl';

import { Cluster } from 'carrelage';
import SpotCluster from 'components/pages/map/SpotCluster';

import 'mapbox-gl/dist/mapbox-gl.css';
import SpotMarker from './SpotMarker';

type Props = {};

type State = {
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    clusters: Cluster[];
};

class MapContainer extends React.Component<Props, State> {
    public state: State = {
        viewport: {
            latitude: 48.860332,
            longitude: 2.345054,
            zoom: 12,
        },
        clusters: [],
    };

    private mapRef = React.createRef<ReactMapGL>();
    private loadTimeout: NodeJS.Timeout;

    public componentDidMount() {
        this.load();
    }

    public render() {
        const markers = [];
        for (const cluster of this.state.clusters) {
            if (cluster.spots.length > 0) {
                cluster.spots.forEach((spot) => {
                    markers.push(<SpotMarker key={spot.id} spot={spot} />);
                });
            } else {
                markers.push(<SpotCluster key={cluster.id} cluster={cluster} />);
            }
        }

        return (
            <div id="city-grid">
                <div id="city-map">
                    <div id="city-map-frame">
                        <ReactMapGL
                            ref={this.mapRef}
                            width="100%"
                            height="100%"
                            {...this.state.viewport}
                            mapboxApiAccessToken={getConfig().publicRuntimeConfig.MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            onViewportChange={this.onViewportChange}
                        >
                            <div style={{ position: 'absolute', right: '1rem', bottom: '2rem' }}>
                                <GeolocateControl
                                    style={{ marginBottom: '1rem' }}
                                    positionOptions={{ enableHighAccuracy: true }}
                                    trackUserLocation={true}
                                />
                                <NavigationControl />
                            </div>
                            {markers}
                        </ReactMapGL>
                    </div>
                </div>
            </div>
        );
    }

    private load() {
        clearTimeout(this.loadTimeout);
        this.loadTimeout = setTimeout(async () => {
            try {
                console.log('Refresh Spots');
                const map = this.mapRef.current.getMap();
                const bounds = map.getBounds();
                const northEast = bounds.getNorthEast();
                const southWest = bounds.getSouthWest();

                const res = await axios.get(`${getConfig().publicRuntimeConfig.CARRELAGE_URL}/spots/search`, {
                    params: {
                        clustering: true,
                        northEastLatitude: northEast.lat,
                        northEastLongitude: northEast.lng,
                        southWestLatitude: southWest.lat,
                        southWestLongitude: southWest.lng,
                    },
                });

                this.setState({ clusters: res.data });
            } catch (err) {
                console.log(err);
            }
        }, 200);
    }

    private onViewportChange = (viewport: ViewportProps, interactionState: ExtraState, oldViewport: ViewportProps) => {
        this.setState({ viewport });
        this.load();
    };
}

export default MapContainer;
