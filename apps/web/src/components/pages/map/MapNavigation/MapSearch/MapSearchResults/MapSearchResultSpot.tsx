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

import { Spot, Status, Types } from '@krak/carrelage-client';
import { SpotHit } from '@/lib/meilisearch';

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
            <button className="relative flex items-center w-full py-2.5 pl-2 pr-4 text-left" onClick={handleSpotClick}>
                <div className="flex flex-col [&_svg]:my-auto [&_svg]:mr-2 [&_svg]:ml-0 [&_svg]:w-9">
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
                <div className="flex flex-col grow overflow-hidden">
                    <Typography className="tracking-[0.2px] text-onDark-highEmphasis" component="subtitle1" truncateLines={1}>
                        {spot.name}
                    </Typography>
                    {spot.location && (
                        <Typography className="mt-0.5 italic text-onDark-lowEmphasis" component="body2" truncateLines={1}>
                            {spot.location.streetNumber} {spot.location.streetName}
                        </Typography>
                    )}
                </div>
                <div className="shrink-0 flex flex-col max-w-[24%] mt-auto ml-4 overflow-hidden">
                    {renderedTags && (
                        <div className="flex items-center justify-end mb-1 [&_svg]:w-4 [&_svg]:mr-1.5 [&_svg:last-child]:mr-0 [&_.ui-Typography]:text-onDark-lowEmphasis">
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
                        </div>
                    )}
                    {spot.location && spot.location.city && (
                        <Typography className="text-right text-onDark-mediumEmphasis" component="body2" truncateLines={1}>
                            {spot.location.city}
                        </Typography>
                    )}
                </div>
            </button>
            <div className="h-px bg-onDark-divider last-of-type:hidden" />
        </>
    );
}
