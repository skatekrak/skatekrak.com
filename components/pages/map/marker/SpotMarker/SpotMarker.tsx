import classNames from 'classnames';
import React from 'react';

import { Marker, MarkerProps } from 'react-map-gl';

import { Spot } from 'lib/carrelageClient';

import BadgeHistory from 'components/pages/map/marker/badges/History';
import BadgeIconic from 'components/pages/map/marker/badges/Iconic';
import BadgeMinute from 'components/pages/map/marker/badges/Minute';
import Activity from 'components/pages/map/marker/Activity';
import { selectSpot } from 'store/map/slice';
import { useAppDispatch, useAppSelector } from 'store/hook';

type SpotMarkerProps = {
    spot: Spot;
    isSelected: boolean;
    small?: boolean;
};

const Pin = ({ imageName }: { imageName: string }) => {
    return (
        <img
            src={`/images/map/icons/${imageName}.png`}
            srcSet={`/images/map/icons/${imageName}@2x.png 2x,/images/map/icons/${imageName}.png 1x`}
            alt={`${imageName} pin`}
        />
    );
};

const SpotMarker = ({ spot, isSelected, small = false }: SpotMarkerProps) => {
    const isCreateSpotOpen = useAppSelector((state) => state.map.isCreateSpotOpen);
    const dispatch = useAppDispatch();
    const active = spot.mediasStat.all >= 10;
    const firing = spot.mediasStat.all >= 30;

    const onMarkerClick: MarkerProps['onClick'] = (event) => {
        event.originalEvent?.stopPropagation();
        if (!isCreateSpotOpen) {
            dispatch(selectSpot(spot.id));
        }
    };

    return (
        <Marker
            key={`marker-${spot.id}`}
            latitude={spot.location.latitude}
            longitude={spot.location.longitude}
            onClick={small ? undefined : onMarkerClick}
        >
            <div
                style={{ opacity: isCreateSpotOpen ? 0.5 : 1 }}
                className={classNames({
                    'map-marker-clicked': isSelected,
                    'map-marker-active': active && !firing,
                    'map-marker-firing': firing,
                })}
            >
                <div
                    className={classNames('map-marker', {
                        'map-marker-firing': firing,
                    })}
                >
                    <div className="map-marker-icon">
                        {spot.status == 'rip' || spot.status === 'wip' ? (
                            <Pin key={`marker-pin-${spot.id}`} imageName={spot.status} />
                        ) : (
                            <Pin key={`marker-pin-${spot.id}`} imageName={spot.type} />
                        )}
                    </div>
                    <div className="map-marker-badges">
                        {spot.tags
                            .filter((tag) => ['famous', 'history', 'minute'].includes(tag))
                            .map((tag) => (
                                <React.Fragment key={`marker-${spot.id}-badge-${tag}`}>
                                    {tag === 'famous' && <BadgeIconic />}
                                    {tag === 'history' && <BadgeHistory />}
                                    {tag === 'minute' && <BadgeMinute />}
                                </React.Fragment>
                            ))}
                    </div>
                    {active && <Activity firing={firing} />}
                </div>
            </div>
        </Marker>
    );
};

export default React.memo(SpotMarker);
