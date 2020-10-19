import React, { useMemo } from 'react';
import ReactMapGL, { Popup, NavigationControl } from 'react-map-gl';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Typings from 'Types';

import { Cluster, Spot, SpotOverview } from 'lib/carrelageClient';
import SpotCluster from 'components/pages/map/marker/SpotCluster';
import SpotMarker from 'components/pages/map/marker/SpotMarker';
import { useDispatchRouterQuery } from 'lib/url-query-hook';

const MIN_ZOOM_LEVEL = 2;
const MAX_ZOOM_LEVEL = 18;

type MapComponentProps = {
    mapRef?: React.RefObject<ReactMapGL>;
    clusters: Cluster[];
    selectedSpotOverview?: SpotOverview;
    onViewportChange?: (viewport: { latitude: number; longitude: number; zoom: number }) => void;
    clustering: boolean;
};

const MapComponent = ({ mapRef, clusters, selectedSpotOverview, onViewportChange, clustering }: MapComponentProps) => {
    const dispatchQuery = useDispatchRouterQuery();
    const mapState = useSelector((state: Typings.RootState) => state.map);

    const markers = useMemo(() => {
        const _markers: JSX.Element[] = [];
        for (const cluster of clusters) {
            if (!clustering || (mapState.viewport.zoom > mapState.viewport.maxZoom - 5.5 && cluster.spots.length > 0)) {
                for (const spot of cluster.spots) {
                    if (_markers.findIndex((m) => m.key === spot.id) === -1) {
                        _markers.push(
                            <SpotMarker
                                key={spot.id}
                                spot={spot}
                                isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                            />,
                        );
                    }
                }
            } else {
                _markers.push(<SpotCluster key={cluster.id} cluster={cluster} viewportZoom={mapState.viewport.zoom} />);
            }
        }
        return _markers;
    }, [clusters, selectedSpotOverview, clustering, mapState.viewport.zoom, mapState.viewport.maxZoom]);

    const onPopupClick = () => {
        dispatchQuery('modal', '1');
    };

    const onPopupClose = () => {
        dispatchQuery('modal');
    };

    return (
        <div id="map">
            <ReactMapGL
                ref={mapRef}
                {...mapState.viewport}
                width="100%"
                height="100%"
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={onViewportChange}
                onClick={onPopupClose}
            >
                {/* Popup */}
                {selectedSpotOverview && (
                    <Popup
                        className="map-popup-spot"
                        longitude={selectedSpotOverview.spot.location.longitude}
                        latitude={selectedSpotOverview.spot.location.latitude}
                        onClose={onPopupClose}
                        tipSize={8}
                        closeButton={false}
                        closeOnClick={false}
                    >
                        <button className="map-popup-spot-container" onClick={onPopupClick}>
                            <h4
                                className={classNames('map-popup-spot-name', {
                                    'map-popup-spot-name-center': !selectedSpotOverview.mostLikedMedia,
                                })}
                            >
                                {selectedSpotOverview.spot.name}
                            </h4>
                            {selectedSpotOverview.mostLikedMedia && (
                                <div className="map-popup-spot-cover-container">
                                    <div
                                        className="map-popup-spot-cover"
                                        style={{
                                            backgroundImage: `url("${selectedSpotOverview.mostLikedMedia.image.jpg}")`,
                                        }}
                                    />
                                </div>
                            )}
                        </button>
                    </Popup>
                )}

                {/* Marker */}
                {markers}

                <div className="map-control-container">
                    <NavigationControl />
                </div>
            </ReactMapGL>
        </div>
    );
};

export default MapComponent;
