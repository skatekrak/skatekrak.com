import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

import type { CustomMap } from 'components/pages/map/MapQuickAccess/MapQuickAccess';
import { toggleLegend, toggleSearchResult } from 'store/map/actions';
import { updateUrlParams } from 'store/map/thunk';

type Props = {
    map: CustomMap;
};

const MapQuickAccessItem = ({ map }: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isMapLoading = false;

    const isMapNotSelected = useMemo(() => {
        return router.query.id !== undefined && router.query.id !== map.id;
    }, [router.query.id, map.id]);

    const isMapSelected = useMemo(() => {
        return router.query.id === map.id;
    }, [router.query.id, map.id]);

    const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(toggleLegend(false));
        dispatch(toggleSearchResult(false));
        dispatch(
            updateUrlParams({
                spotId: null,
                modal: false,
                customMapId: map.id,
            }),
        );
    };

    return (
        <a
            href="map"
            onClick={onClick}
            className={classNames('map-quick-access-item', {
                'map-quick-access-item--selected': isMapSelected,
            })}
        >
            <div className="map-quick-access-item-image-container">
                {isMapLoading ? (
                    <SpinnerCircle />
                ) : (
                    <img
                        className={classNames('map-quick-access-item-image', {
                            'map-quick-access-item-image--not-selected': isMapNotSelected,
                        })}
                        src={`/images/map/custom-maps/${map.id}.png`}
                        srcSet={`
                                /images/map/custom-maps/${map.id}.png 1x,
                                /images/map/custom-maps/${map.id}@2x.png 2x,
                                /images/map/custom-maps/${map.id}@3x.png 3x
                            `}
                        alt={`${map.name} map logo`}
                    />
                )}
            </div>
            <div className="map-quick-access-item-description">
                <div className="map-quick-access-item-header">
                    <h4 className="map-quick-access-item-name">{map.name}</h4>
                    <IconArrowHead />
                </div>
                <p className="map-quick-access-item-body">{map.edito}</p>
                <p className="map-quick-access-item-spots">{map.numberOfSpots} spots</p>
            </div>
        </a>
    );
};

export default React.memo(MapQuickAccessItem);
