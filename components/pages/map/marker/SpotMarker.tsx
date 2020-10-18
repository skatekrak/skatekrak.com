import classNames from 'classnames';
import React from 'react';

import { Marker } from 'react-map-gl';

import { Spot } from 'lib/carrelageClient';

import BadgeHistory from 'components/pages/map/marker/badges/History';
import BadgeIconic from 'components/pages/map/marker/badges/Iconic';
import BadgeMinute from 'components/pages/map/marker/badges/Minute';
import Activity from 'components/pages/map/marker/Activity';
import { useDispatchRouterQuery } from 'lib/url-query-hook';

type SpotMarkerProps = {
    spot: Spot;
    onSpotMarkerClick: (spot: Spot) => void;
    isSelected: boolean;
};

const Pin = ({ imageName }: { imageName: string }) => {
    return (
        <img
            src={`/images/map/icons/${imageName}.png`}
            srcSet={`/images/map/icons/${imageName}@2x.png 2x,/images/map/icons/${imageName}.png 1x`}
        />
    );
};

const SpotMarker = ({ spot, onSpotMarkerClick, isSelected }: SpotMarkerProps) => {
    const dispatchQuery = useDispatchRouterQuery();
    const active = spot.mediasStat.all > 3;
    const firing = spot.mediasStat.all >= 10;

    const onMarkerClick = () => {
        // onSpotMarkerClick(spot);
        dispatchQuery('spot', spot.id);
    };

    return (
        <Marker
            latitude={spot.location.latitude}
            longitude={spot.location.longitude}
            offsetLeft={-24}
            offsetTop={-24}
            className={classNames({
                'map-marker-clicked': isSelected,
                'map-marker-active': active && !firing,
                'map-marker-firing': firing,
            })}
        >
            <button
                className={classNames('map-marker', {
                    'map-marker-firing': firing,
                })}
                onClick={onMarkerClick}
            >
                <div className="map-marker-icon">
                    {(spot.status == 'rip' || spot.status === 'wip') && <Pin key={spot.id} imageName={spot.status} />}
                    {spot.status === 'active' && <Pin key={spot.id} imageName={spot.type} />}
                </div>
                {spot.tags.length !== 0 && (
                    <div className="map-marker-badges">
                        {spot.tags.map((tag) => (
                            <React.Fragment key={tag}>
                                {tag === 'famous' && <BadgeIconic />}
                                {tag === 'history' && <BadgeHistory />}
                                {tag === 'minute' && <BadgeMinute />}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {active && <Activity firing={firing} />}
            </button>
        </Marker>
    );
};

export default React.memo(SpotMarker);
