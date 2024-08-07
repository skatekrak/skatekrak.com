import classNames from 'classnames';
import React from 'react';

import { Marker, MarkerProps } from 'react-map-gl';

import { SpotGeoJSON } from '@krak/carrelage-client';

import BadgeHistory from '@/components/pages/map/marker/badges/History';
import BadgeIconic from '@/components/pages/map/marker/badges/Iconic';
import BadgeMinute from '@/components/pages/map/marker/badges/Minute';
import Activity from '@/components/pages/map/marker/Activity';
import { useSpotID } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

type SpotMarkerProps = {
    spot: SpotGeoJSON;
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
    const isCreateSpotOpen = useMapStore((state) => state.isCreateSpotOpen);
    const [, setSpotID] = useSpotID();
    const active = spot.properties.mediasStat.all >= 10;
    const firing = spot.properties.mediasStat.all >= 30;

    const onMarkerClick: MarkerProps['onClick'] = (event) => {
        event.originalEvent?.stopPropagation();
        if (!isCreateSpotOpen) {
            setSpotID(spot.properties.id);
        }
    };

    return (
        <Marker
            key={`marker-${spot.id}`}
            latitude={spot.geometry.coordinates[1]}
            longitude={spot.geometry.coordinates[0]}
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
                        <Pin key={`marker-pin-${spot.properties.id}`} imageName={spot.properties.type} />
                    </div>
                    <div className="map-marker-badges">
                        {spot.properties.tags
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
