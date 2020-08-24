import React, { useMemo } from 'react';
import ReactMapGL, { Popup, NavigationControl } from 'react-map-gl';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Typings from 'Types';

import { Cluster, Spot, SpotOverview } from 'lib/carrelageClient';
import SpotCluster from 'components/pages/map/marker/SpotCluster';
import SpotMarker from 'components/pages/map/marker/SpotMarker';

const MIN_ZOOM_LEVEL = 4;
const MAX_ZOOM_LEVEL = 18;

type MapComponentProps = {
    mapRef?: React.RefObject<ReactMapGL>;
    clusters: Cluster[];
    selectedSpotOverview?: SpotOverview;
    onSpotMarkerClick: (spot: Spot) => void;
    onViewportChange?: (viewport: { latitude: number; longitude: number; zoom: number }) => void;
    onPopupClose?: () => void;
};

const MapComponent = ({
    mapRef,
    clusters,
    selectedSpotOverview,
    onSpotMarkerClick,
    onViewportChange,
    onPopupClose,
}: MapComponentProps) => {
    const mapState = useSelector((state: Typings.RootState) => state.map);

    const markers = useMemo(() => {
        const _markers: JSX.Element[] = [];
        for (const cluster of clusters) {
            if (mapRef.current.props.zoom > mapRef.current.props.maxZoom - 5.5 && cluster.spots.length > 0) {
                for (const spot of cluster.spots) {
                    _markers.push(
                        <SpotMarker
                            key={spot.id}
                            spot={spot}
                            viewport={mapState.viewport}
                            onSpotMarkerClick={onSpotMarkerClick}
                            isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                        />,
                    );
                }
            } else {
                _markers.push(<SpotCluster key={cluster.id} cluster={cluster} viewportZoom={mapState.viewport.zoom} />);
            }
        }
        return _markers;
    }, [clusters, selectedSpotOverview]);

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
