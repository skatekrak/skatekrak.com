import React, { useState, useMemo } from 'react';
import classNames from 'classnames';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { useRouter } from 'next/router';
import Link from 'next/link';

import type { CustomMap } from './MapCustomNavigationTrail';

type Props = {
    map: CustomMap;
};

const MapCustomNavigationItem = ({ map }: Props) => {
    const router = useRouter();
    const [isMapLoading, setIsMapLoading] = useState(false);

    const isMapSelected = useMemo(() => {
        return router.query.id === map.id;
    }, [router.query.id]);

    return (
        <Link href="/map?id=volcom" as="/map/volcom" shallow>
            <a
                className={classNames('custom-map-navigation-item', {
                    'custom-map-navigation-item--selected': isMapSelected,
                })}
            >
                <div className="custom-map-navigation-item-image-container">
                    {isMapLoading ? (
                        <SpinnerCircle />
                    ) : (
                        <img
                            className="custom-map-navigation-item-image"
                            src="/images/favicon_32.png"
                            alt={`${map.name} map logo`}
                        />
                    )}
                </div>
                <div className="custom-map-navigation-item-description">
                    <div className="custom-map-navigation-item-header">
                        <h4 className="custom-map-navigation-item-name">{map.name}</h4>
                        <IconArrowHead />
                    </div>
                    <p className="custom-map-navigation-item-body">{map.about}</p>
                    <p className="custom-map-navigation-item-spots">{map.numberOfSpots} spots</p>
                </div>
            </a>
        </Link>
    );
};

export default MapCustomNavigationItem;
