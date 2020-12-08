import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

import type { CustomMap } from './MapCustomNavigationTrail';
import { toggleLegend, toggleSearchResult, updateUrlParams } from 'store/map/actions';

type Props = {
    map: CustomMap;
};

const MapCustomNavigationItem = ({ map }: Props) => {
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
                spotId: undefined,
                modal: false,
                customMapId: map.id,
            }),
        );
    };

    return (
        <a
            href="map"
            onClick={onClick}
            className={classNames('custom-map-navigation-item', {
                'custom-map-navigation-item--selected': isMapSelected,
            })}
        >
            <div className="custom-map-navigation-item-image-container">
                {isMapLoading ? (
                    <SpinnerCircle />
                ) : (
                    <img
                        className={classNames('custom-map-navigation-item-image', {
                            'custom-map-navigation-item-image--not-selected': isMapNotSelected,
                        })}
                        src={`/images/map/custom-maps/${map.id}.png`}
                        srcSet={`
                                /images/map/custom-maps/${map.id}.png 1x,
                                /images/map/custom-maps/${map.id}-@2x.png 2x,
                                /images/map/custom-maps/${map.id}-@3x.png 3x
                            `}
                        alt={`${map.name} map logo`}
                    />
                )}
            </div>
            <div className="custom-map-navigation-item-description">
                <div className="custom-map-navigation-item-header">
                    <h4 className="custom-map-navigation-item-name">{map.name}</h4>
                    <IconArrowHead />
                </div>
                <p className="custom-map-navigation-item-body">{map.edito}</p>
                <p className="custom-map-navigation-item-spots">{map.numberOfSpots} spots</p>
            </div>
        </a>
    );
};

export default React.memo(MapCustomNavigationItem);
