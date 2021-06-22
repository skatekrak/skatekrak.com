import React from 'react';
import classNames from 'classnames';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';

import type { QuickAccess, QuickAccessMap } from 'components/pages/map/MapQuickAccess/MapQuickAccess';

type Props = {
    data: QuickAccessMap | QuickAccess;
    selected?: boolean;
    noMapSelected: boolean;
    onClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessItem = ({ data, selected, noMapSelected, onClick }: Props) => {
    const isQuickAccessMap = (data: unknown): data is QuickAccessMap => {
        return data != null && (data as QuickAccessMap).numberOfSpots != null;
    };

    return (
        <a
            href="map"
            onClick={onClick}
            className={classNames('map-quick-access-item', {
                'map-quick-access-item--selected': selected,
            })}
        >
            <div className="map-quick-access-item-image-container">
                <img
                    className={classNames('map-quick-access-item-image', {
                        'map-quick-access-item-image--not-selected': noMapSelected,
                    })}
                    src={`/images/map/custom-maps/${data.id}.png`}
                    srcSet={getSrcSet(data.id, isQuickAccessMap(data))}
                    alt={`${data.name} map logo`}
                />
            </div>
            <div className="map-quick-access-item-description">
                <div className="map-quick-access-item-header">
                    <h4 className="map-quick-access-item-name">{data.name}</h4>
                    <IconArrowHead />
                </div>
                <p className="map-quick-access-item-body">{data.edito}</p>
                {isQuickAccessMap(data) && <p className="map-quick-access-item-spots">{data.numberOfSpots} spots</p>}
            </div>
        </a>
    );
};

function getSrcSet(id: string, isQuickAccessMap: boolean): string {
    if (isQuickAccessMap) {
        return `/images/map/custom-maps/${id}.png 1x,
        /images/map/custom-maps/${id}@2x.png 2x,
        /images/map/custom-maps/${id}@3x.png 3x`;
    }

    return `
        /images/map/cities/${id}.jpg 1x,
        /images/map/cities/${id}@2x.jpg 2x,
        /images/map/cities/${id}@3x.jpg 3x
    `;
}

export default React.memo(MapQuickAccessItem);
