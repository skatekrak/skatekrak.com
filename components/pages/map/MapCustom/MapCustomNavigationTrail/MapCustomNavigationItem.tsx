import React, { useState } from 'react';
import classNames from 'classnames';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    map: any;
};

const MapCustomNavigationItem = ({ map }: Props) => {
    const [isMapSelected, setIsMapSelected] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(false);

    const onMapClick = () => {
        setIsMapLoading(true);
        if (isMapSelected) {
            setIsMapSelected(false);
        }
        setTimeout(() => {
            setIsMapSelected(!isMapSelected);
            setIsMapLoading(false);
        }, 1000);
    };

    return (
        <button
            onClick={onMapClick}
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
                <p className="custom-map-navigation-item-body">{map.desc}</p>
                <p className="custom-map-navigation-item-spots">{map.nbSpot} spots</p>
            </div>
        </button>
    );
};

export default MapCustomNavigationItem;
