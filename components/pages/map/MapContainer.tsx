import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import ReactMapGL, { ViewportProps } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

type Props = {};

type State = {
    viewport: {
        // width: number,
        // height: number,
        latitude: number;
        longitude: number;
        zoom: number;
    };
};

const mapbox = (id: string, token: string) => (x, y, z, dpr) => {
    return `https://api.mapbox.com/styles/v1/mapbox/${id}/tiles/256/${z}/${x}/${y}${
        dpr >= 2 ? '@2x' : ''
    }?access_token=${token}`;
};

const MapboxAttribution = () => (
    <span className="map-attribution">
        <span>
            © <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
        </span>
        {' | '}
        <span>
            © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
        </span>
        {' | '}
        <strong>
            <a href="https://www.mapbox.com/map-feedback/" target="_blank">
                Improve this map
            </a>
        </strong>
    </span>
);

class MapContainer extends React.Component<Props, State> {
    public state: State = {
        viewport: {
            // width: 400,
            // height: 400,
            latitude: 48.860332,
            longitude: 2.345054,
            zoom: 12,
        },
    };

    public async componentDidMount() {}

    public render() {
        return (
            <div id="city-grid">
                <div id="city-map">
                    <div id="city-map-frame">
                        <ReactMapGL
                            width="100%"
                            height="100%"
                            {...this.state.viewport}
                            mapboxApiAccessToken={getConfig().publicRuntimeConfig.MAPBOX_ACCESS_TOKEN}
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            onViewportChange={this.syncViewPort}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private async load() {
        try {
            const res = await axios.get(`${getConfig().publicRuntimeConfig.CARRELAGE_URL}/spots/search`, {
                params: {
                    clustering: true,
                    // northEastLatitude: ,
                    // northEastLongitude: ,
                    // southWestLatitude: ,
                    // southWestLongitude: ,
                },
            });
            return { video: res.data, gotId: true };
        } catch {
            return { gotId: true };
        }
    }

    private syncViewPort = (viewport: ViewportProps) => {
        this.setState({ viewport });
    };
}

export default MapContainer;
