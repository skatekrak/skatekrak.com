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
        return data !== null && typeof (data as QuickAccessMap).numberOfSpots === 'string';
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
                    srcSet={`
                            /images/map/custom-maps/${data.id}.png 1x,
                            /images/map/custom-maps/${data.id}@2x.png 2x,
                            /images/map/custom-maps/${data.id}@3x.png 3x
                        `}
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

export default React.memo(MapQuickAccessItem);
