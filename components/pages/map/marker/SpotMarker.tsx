import classNames from 'classnames';
import React from 'react';

import { Marker, MapboxEvent } from 'react-map-gl';

import { Spot, Status } from 'lib/carrelageClient';

import BadgeHistory from 'components/pages/map/marker/badges/History';
import BadgeIconic from 'components/pages/map/marker/badges/Iconic';
import BadgeMinute from 'components/pages/map/marker/badges/Minute';
import Activity from 'components/pages/map/marker/Activity';
import { selectSpot } from 'store/map/slice';
import { useAppDispatch } from 'store/hook';

import * as S from './SpotMarker.styled';

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
        />
    );
};

const SpotMarker = ({ spot, isSelected, small = false }: SpotMarkerProps) => {
    const dispatch = useAppDispatch();
    const active = spot.mediasStat.all > 3;
    const firing = spot.mediasStat.all >= 10;

    const onMarkerClick = (event: MapboxEvent<Event>) => {
        event.originalEvent?.stopPropagation();
        dispatch(selectSpot(spot.id));
    };

    return (
        <Marker
            key={spot.id}
            latitude={spot.location.latitude}
            longitude={spot.location.longitude}
            onClick={small ? undefined : onMarkerClick}
        >
            {small ? (
                <S.SpotMarkSmall filter={spot.status !== Status.Active ? spot.status : spot.type} />
            ) : (
                <div
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
                            {(spot.status == 'rip' || spot.status === 'wip') && (
                                <Pin key={spot.id} imageName={spot.status} />
                            )}
                            {spot.status === 'active' && <Pin key={spot.id} imageName={spot.type} />}
                        </div>
                        <div className="map-marker-badges">
                            {spot.tags.map((tag) => (
                                <React.Fragment key={tag}>
                                    {tag === 'famous' && <BadgeIconic />}
                                    {tag === 'history' && <BadgeHistory />}
                                    {tag === 'minute' && <BadgeMinute />}
                                </React.Fragment>
                            ))}
                        </div>
                        {active && <Activity firing={firing} />}
                    </div>
                </div>
            )}
        </Marker>
    );
};

export default React.memo(SpotMarker);
