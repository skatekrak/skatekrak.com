import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import getConfig from 'next/config';
import React from 'react';
import ReactMapGL, {
    ExtraState,
    FlyToInterpolator,
    GeolocateControl,
    InteractiveMap,
    NavigationControl,
    TransitionInterpolator,
    ViewportProps,
} from 'react-map-gl';
import WebMercatorViewport, { getDistanceScales } from 'viewport-mercator-project';

import { Cluster } from 'carrelage';
import SpotCluster from 'components/pages/map/SpotCluster';
import SpotMarker from 'components/pages/map/SpotMarker';

import 'mapbox-gl/dist/mapbox-gl.css';

type Props = {};

type State = {
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    pixelsPerDegree: [number, number, number];
    clusters: Cluster[];
};

class MapContainer extends React.Component<Props, State> {
    public state: State = {
        viewport: {
            latitude: 48.860332,
            longitude: 2.345054,
            zoom: 12,
        },
        pixelsPerDegree: [0, 0, 0],
        clusters: [],
    };

    private mapRef = React.createRef<InteractiveMap>();
    private loadTimeout: NodeJS.Timeout;

    public componentDidMount() {
        this.load();
    }

    public render() {
        const markers = [];
        for (const cluster of this.state.clusters) {
            if (this.mapRef.current.props.zoom > this.mapRef.current.props.maxZoom - 2) {
                cluster.spots.forEach((spot) => {
                    markers.push(<SpotMarker key={spot.id} spot={spot} fitBounds={this.fitBounds} />);
                });
            } else {
                markers.push(
                    <SpotCluster
                        key={cluster.id}
                        cluster={cluster}
                        pixelsPerDegree={this.state.pixelsPerDegree}
                        fitBounds={this.fitBounds}
                    />,
                );
            }
        }

        return (
            <div id="city-grid">
                <div id="city-map">
                    <div id="city-map-frame">
                        <ReactMapGL
                            ref={this.mapRef}
                            {...this.state.viewport}
                            width="100%"
                            height="100%"
                            minZoom={2}
                            maxZoom={20}
                            mapboxApiAccessToken={getConfig().publicRuntimeConfig.MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            onViewportChange={this.onViewportChange}
                        >
                            {markers}
                            <div style={{ position: 'absolute', right: '1rem', bottom: '2rem' }}>
                                <GeolocateControl
                                    style={{ marginBottom: '1rem' }}
                                    positionOptions={{ enableHighAccuracy: true }}
                                    trackUserLocation={true}
                                />
                                <NavigationControl />
                            </div>
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

                const clusters = res.data as Cluster[];
                console.log('Load');
                this.setState({ clusters });
            } catch (err) {
                console.log(err);
            }
        }, 200);
    }

    private fitBounds = (b1: [number, number], b2: [number, number]) => {
        const { longitude, latitude, zoom } = new WebMercatorViewport(this.state.viewport).fitBounds([b1, b2], {
            padding: 20,
        });
        const maxZoom = this.mapRef.current.props.maxZoom;
        const viewport = {
            ...this.state.viewport,
            longitude,
            latitude,
            zoom: zoom < maxZoom ? zoom : maxZoom,
        };
        this.onViewportChange(viewport);
    };

    private onViewportChange = (viewport: { latitude: number; longitude: number; zoom: number }) => {
        console.log('onViewportChange');
        this.setState({ viewport, pixelsPerDegree: getDistanceScales(viewport).pixelsPerDegree });
        this.load();
    };
}

export default MapContainer;
