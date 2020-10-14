import React, { useState, useEffect } from 'react';

import StreetIcon from 'components/pages/map/marker/icons/Street';
import ParkIcon from 'components/pages/map/marker/icons/Park';
import DiyIcon from 'components/pages/map/marker/icons/Diy';
import ShopIcon from 'components/pages/map/marker/icons/Shop';
import PrivateIcon from 'components/pages/map/marker/icons/Private';
import WipIcon from 'components/pages/map/marker/icons/Wip';
import RipIcon from 'components/pages/map/marker/icons/Rip';
import IconicBadge from 'components/pages/map/marker/badges/Iconic';
import HistoryBadge from 'components/pages/map/marker/badges/History';
import MinuteBadge from 'components/pages/map/marker/badges/Minute';

import { Status, Types } from 'lib/carrelageClient';
import type { SpotHit } from 'lib/algolia';

type Props = {
    spot: SpotHit;
    onSpotClick: (spot: SpotHit) => void;
};

const MapSearchResultSpot = ({ spot, onSpotClick }: Props) => {
    const [overBadgeCounter, setOverBadgeCounter] = useState<number | undefined>(undefined);

    const renderedTags = spot.tags?.filter((tag, index: number, originaltags) => {
        if (originaltags.length > 5 && index < 4) {
            return tag;
        }
    });

    useEffect(() => {
        if (spot.tags?.length > 5) {
            setOverBadgeCounter(spot.tags.length - 4);
        }
    }, [spot.tags]);

    const handleSpotClick = () => {
        onSpotClick(spot);
    };

    return (
        <>
            <button className="map-navigation-search-result-spot" onClick={handleSpotClick}>
                <div className="map-navigation-search-result-spot-icon">
                    {spot.status === Status.Active && (
                        <>
                            {spot.type === Types.Park && <ParkIcon />}
                            {spot.type === Types.Street && <StreetIcon />}
                            {spot.type === Types.Shop && <ShopIcon />}
                            {spot.type === Types.Diy && <DiyIcon />}
                            {spot.type === Types.Private && <PrivateIcon />}
                        </>
                    )}
                    {spot.status === Status.Wip && <WipIcon />}
                    {spot.status === Status.Rip && <RipIcon />}
                </div>
                <div className="map-navigation-search-result-spot-container-start">
                    <p className="map-navigation-search-result-spot-name">{spot.name}</p>
                    {spot.location && (
                        <p className="map-navigation-search-result-spot-street">
                            {spot.location.streetNumber} {spot.location.streetName}
                        </p>
                    )}
                </div>
                <div className="map-navigation-search-result-spot-container-end">
                    {renderedTags && (
                        <div className="map-navigation-search-result-spot-badges">
                            {renderedTags.map((tag) => (
                                <React.Fragment key={tag}>
                                    {tag === 'famous' && <IconicBadge />}
                                    {tag === 'history' && <HistoryBadge />}
                                    {tag === 'minute' && <MinuteBadge />}
                                </React.Fragment>
                            ))}
                            {overBadgeCounter && (
                                <div className="map-navigation-search-result-spot-badges-counter">
                                    +{overBadgeCounter}
                                </div>
                            )}
                        </div>
                    )}
                    {spot.location && spot.location.city && (
                        <p className="map-navigation-search-result-spot-city">{spot.location.city}</p>
                    )}
                </div>
            </button>
            <div className="map-navigation-search-result-spot-divider" />
        </>
    );
};

export default MapSearchResultSpot;
