import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import ReactMapGL, {
    // GeolocateControl,
    InteractiveMap,
    NavigationControl,
    Popup,
} from 'react-map-gl';
import { connect } from 'react-redux';
import WebMercatorViewport, { getDistanceScales } from 'viewport-mercator-project';

import Types from 'Types';

import { Cluster, Spot } from 'carrelage';

import SpotCluster from 'components/pages/map/marker/SpotCluster';
import SpotMarker from 'components/pages/map/marker/SpotMarker';
import BannerTop from 'components/Ui/Banners/BannerTop';

type Props = {
    isMobile: boolean;
};

type State = {
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    pixelsPerDegree: [number, number, number];
    clusters: Cluster[];
    clusterMaxSpots: number;
    popupInfo: Spot;
    popupImage?: string;
    isPopupImageLoading: boolean;
    spotMarkerClicked?: string;
};

const MIN_ZOOM_LEVEL = 4;
const MAX_ZOOM_LEVEL = 18;

class MapContainer extends React.Component<Props, State> {
    public state: State = {
        viewport: {
            latitude: 48.860332,
            longitude: 2.345054,
            zoom: 12,
        },
        pixelsPerDegree: [0, 0, 0],
        clusters: [],
        clusterMaxSpots: 1,
        popupInfo: null,
        isPopupImageLoading: false,
        spotMarkerClicked: null,
    };

    private mapRef = React.createRef<InteractiveMap>();
    private loadTimeout: NodeJS.Timeout;

    public componentDidMount() {
        this.load();
    }

    public render() {
        const { popupInfo, isPopupImageLoading, popupImage, spotMarkerClicked } = this.state;
        const { isMobile } = this.props;

        const markers = [];
        for (const cluster of this.state.clusters) {
            if (this.mapRef.current.props.zoom > this.mapRef.current.props.maxZoom - 5.5 && cluster.spots.length > 0) {
                for (const spot of cluster.spots) {
                    markers.push(
                        <SpotMarker
                            key={spot.id}
                            spot={spot}
                            viewport={this.state.viewport}
                            fitBounds={this.fitBounds}
                            onSpotMarkerClick={this.onSpotMarkerClick}
                            spotMarkerClicked={spotMarkerClicked}
                        />,
                    );
                }
            } else {
                markers.push(
                    <SpotCluster key={cluster.id} cluster={cluster} viewportZoom={this.state.viewport.zoom} />,
                );
            }
        }

        return (
            <div
                id="map-container"
                className={classNames({
                    'map-mobile': isMobile,
                })}
            >
                {isMobile && (
                    <div id="map-mobile-message">
                        If you wanna enjoy our skatespots map and you're currently on your mobile, best way is to{' '}
                        <a href="/app" id="map-mobile-message-link">
                            download the app
                        </a>
                    </div>
                )}
                <BannerTop
                    offsetScroll={false}
                    link="/app"
                    text="The world is our playground. Download the app & help us enrich this map."
                />
                <div id="map">
                    <ReactMapGL
                        ref={this.mapRef}
                        {...this.state.viewport}
                        width="100%"
                        height="100%"
                        minZoom={MIN_ZOOM_LEVEL}
                        maxZoom={MAX_ZOOM_LEVEL}
                        mapboxApiAccessToken={getConfig().publicRuntimeConfig.MAPBOX_ACCESS_TOKEN}
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        onViewportChange={this.onViewportChange}
                        onClick={this.onPopupclose}
                    >
                        {/* Popup */}
                        {popupInfo && (
                            <Popup
                                className="map-popup-spot"
                                longitude={popupInfo.location.longitude}
                                latitude={popupInfo.location.latitude}
                                onClose={this.onPopupclose}
                                tipSize={8}
                                closeButton={false}
                                closeOnClick={false}
                            >
                                <h4
                                    className={classNames('map-popup-spot-name', {
                                        'map-popup-spot-name-center': !popupImage,
                                    })}
                                >
                                    {popupInfo.name}
                                </h4>
                                {popupImage && (
                                    <div className="map-popup-spot-cover-container">
                                        {!isPopupImageLoading && (
                                            <div
                                                className="map-popup-spot-cover"
                                                style={{ backgroundImage: `url("${popupImage}")` }}
                                            />
                                        )}
                                    </div>
                                )}
                            </Popup>
                        )}

                        {/* Define svg gradients here */}
                        <div id="map-gradients">
                            <svg width="0" height="0">
                                <defs>
                                    {/* Icon */}
                                    <linearGradient id="map-gradients-street" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-park" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-shop" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-private" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-diy" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-rip" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="60%" className="stop-2" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    <linearGradient id="map-gradients-wip" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" className="stop-top" />
                                        <stop offset="100%" className="stop-bottom" />
                                    </linearGradient>
                                    {/* Badge */}
                                    <linearGradient id="map-gradients-iconic" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#FFEB38" />
                                        <stop offset="25%" stopColor="#E6D432" />
                                        <stop offset="45%" stopColor="#BDAE28" />
                                        <stop offset="65%" stopColor="#FAE634" />
                                        <stop offset="100%" stopColor="#766C14" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Marker */}
                        {markers}

                        {/* Controller */}
                        {/* <FullscreenControl
                            container={document.querySelector('#map-container')}
                            className="map-control-fullscreen"
                        /> */}
                        <div className="map-control-container">
                            {/* <GeolocateControl
                                className="map-control-geolocalisation"
                                positionOptions={{ enableHighAccuracy: false }}
                                trackUserLocation={true}
                            /> */}
                            <NavigationControl />
                        </div>
                    </ReactMapGL>
                </div>
            </div>
        );
    }

    private load() {
        clearTimeout(this.loadTimeout);
        this.loadTimeout = setTimeout(async () => {
            if (this.mapRef.current) {
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
                let clusterMaxSpots = 1;
                for (const cluster of clusters) {
                    if (clusterMaxSpots < cluster.count) {
                        clusterMaxSpots = cluster.count;
                    }
                }
                this.setState({ clusters, clusterMaxSpots });
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
        this.setState({
            viewport,
            pixelsPerDegree: getDistanceScales(viewport).pixelsPerDegree,
        });
        this.load();
    };

    private onPopupclose = () => {
        this.setState({
            popupInfo: null,
            spotMarkerClicked: null,
            popupImage: null,
        });
    };

    private onSpotMarkerClick = async (spot: Spot) => {
        this.setState({
            isPopupImageLoading: true,
            popupInfo: spot,
            spotMarkerClicked: spot.id,
        });

        try {
            const res = await axios.get(`${getConfig().publicRuntimeConfig.CARRELAGE_URL}/spots/${spot.id}/overview`);

            if (res.data) {
                const { mostLikedMedia } = res.data;

                if (!mostLikedMedia) {
                    this.setState({ popupImage: null, isPopupImageLoading: false });
                } else {
                    this.setState({ popupImage: mostLikedMedia.image.jpg, isPopupImageLoading: false });
                }
            }
        } catch (err) {
            // console.log(err);
        }
    };
}

// export default MapContainer;

export default connect(({ settings }: Types.RootState) => ({
    isMobile: settings.isMobile,
}))(MapContainer);