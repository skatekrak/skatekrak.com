import React, { useState, useEffect } from 'react';

import Typography from '@/components/Ui/typography/Typography';
import StreetIcon from '@/components/pages/map/marker/icons/Street';
import ParkIcon from '@/components/pages/map/marker/icons/Park';
import DiyIcon from '@/components/pages/map/marker/icons/Diy';
import ShopIcon from '@/components/pages/map/marker/icons/Shop';
import PrivateIcon from '@/components/pages/map/marker/icons/Private';
import WipIcon from '@/components/pages/map/marker/icons/Wip';
import RipIcon from '@/components/pages/map/marker/icons/Rip';
import IconicBadge from '@/components/pages/map/marker/badges/Iconic';
import HistoryBadge from '@/components/pages/map/marker/badges/History';
import MinuteBadge from '@/components/pages/map/marker/badges/Minute';
import * as S from './MapSearchResults.styled';

import { Spot, Status, Types } from '@krak/carrelage-client';
import { SpotHit } from '@/lib/algolia';

type Props<T> = {
    spot: T;
    onSpotClick: (spot: T) => void;
};

export default function MapSearchResultSpot<T extends Spot | SpotHit>({ spot, onSpotClick }: Props<T>) {
    const [overBadgeCounter, setOverBadgeCounter] = useState<number | undefined>(undefined);

    const renderedTags = spot.tags?.filter((tag) => {
        if (tag === 'famous' || tag === 'history' || tag === 'minute') {
            return tag;
        }
    });

    useEffect(() => {
        if (renderedTags.length > 3) {
            setOverBadgeCounter(renderedTags.length - 3);
        }
    }, [renderedTags]);

    const handleSpotClick = () => {
        onSpotClick(spot);
    };

    return (
        <>
            <S.MapSearchResultSpot onClick={handleSpotClick}>
                <S.MapSearchResultSpotIcon>
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
                </S.MapSearchResultSpotIcon>
                <S.MapSearchResultSpotMain>
                    <S.MapSearchResultSpotName component="subtitle1" truncateLines={1}>
                        {spot.name}
                    </S.MapSearchResultSpotName>
                    {spot.location && (
                        <S.MapSearchResultSpotStreet component="body2" truncateLines={1}>
                            {spot.location.streetNumber} {spot.location.streetName}
                        </S.MapSearchResultSpotStreet>
                    )}
                </S.MapSearchResultSpotMain>
                <S.MapSearchResultSpotDetails>
                    {renderedTags && (
                        <S.MapSearchResultSpotBadges>
                            {renderedTags.map((tag) => (
                                <React.Fragment key={tag}>
                                    {tag === 'famous' || tag === 'history' || tag === 'minute' ? (
                                        <>
                                            {tag === 'famous' && <IconicBadge />}
                                            {tag === 'history' && <HistoryBadge />}
                                            {tag === 'minute' && <MinuteBadge />}
                                        </>
                                    ) : (
                                        <img src={`/images/map/custom-maps/${tag}`} />
                                    )}
                                </React.Fragment>
                            ))}
                            {overBadgeCounter && <Typography component="body2">+{overBadgeCounter}</Typography>}
                        </S.MapSearchResultSpotBadges>
                    )}
                    {spot.location && spot.location.city && (
                        <S.MapSearchResultSpotCity component="body2" truncateLines={1}>
                            {spot.location.city}
                        </S.MapSearchResultSpotCity>
                    )}
                </S.MapSearchResultSpotDetails>
            </S.MapSearchResultSpot>
            <S.MapSearchResultSpotDivider />
        </>
    );
}
