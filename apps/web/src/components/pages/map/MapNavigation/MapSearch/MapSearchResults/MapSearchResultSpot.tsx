import React, { useEffect, useState } from 'react';

import type { Media, Spot } from '@krak/contracts';
import { Status, Types } from '@krak/types';
import { cn } from '@krak/ui';

import { MapSpotCover } from '@/components/pages/map/_components';
import HistoryBadge from '@/components/pages/map/marker/badges/History';
import IconicBadge from '@/components/pages/map/marker/badges/Iconic';
import MinuteBadge from '@/components/pages/map/marker/badges/Minute';
import DiyIcon from '@/components/pages/map/marker/icons/Diy';
import ParkIcon from '@/components/pages/map/marker/icons/Park';
import PrivateIcon from '@/components/pages/map/marker/icons/Private';
import RipIcon from '@/components/pages/map/marker/icons/Rip';
import ShopIcon from '@/components/pages/map/marker/icons/Shop';
import StreetIcon from '@/components/pages/map/marker/icons/Street';
import WipIcon from '@/components/pages/map/marker/icons/Wip';
import Typography from '@/components/Ui/typography/Typography';
import { SpotHit } from '@/lib/meilisearch';

type Props<T> = {
    spot: T;
    onSpotClick: (spot: T) => void;
    display?: 'row' | 'card';
    media?: Pick<Media, 'type' | 'image' | 'video'> | null;
};

export default function MapSearchResultSpot<T extends Spot | SpotHit>({
    spot,
    onSpotClick,
    display = 'row',
    media,
}: Props<T>) {
    const handleSpotClick = () => {
        onSpotClick(spot);
    };

    if (display === 'card') {
        return (
            <button
                className="flex flex-col w-full overflow-hidden border border-solid border-onDark-divider hover:border-onDark-placeholder rounded-lg"
                onClick={handleSpotClick}
            >
                <MapSpotCover media={media} alt={spot.name} className="w-full" />
                <MapSearchResultSpotBase spot={spot} display={display} />
            </button>
        );
    }

    return (
        <>
            <button className="w-full" onClick={handleSpotClick}>
                <MapSearchResultSpotBase spot={spot} display={display} />
            </button>
            <div className="h-px bg-onDark-divider last-of-type:hidden" />
        </>
    );
}

const MapSearchResultSpotBase = ({ spot, display }: { spot: Spot | SpotHit; display: 'row' | 'card' }) => {
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

    return (
        <div className="flex items-center w-full py-2.5 pl-2 pr-4 text-left">
            <div className="flex flex-col [&_svg]:my-auto [&_svg]:mr-2 [&_svg]:ml-0 [&_svg]:w-10">
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
            <div className="flex flex-col grow gap-0.5 overflow-hidden">
                <Typography
                    className={cn('tracking-[0.2px] text-onDark-highEmphasis', {
                        'text-lg!': display === 'card',
                    })}
                    component="subtitle1"
                    truncateLines={1}
                >
                    {spot.name}
                </Typography>
                {spot.location.streetName && (
                    <Typography className="italic text-onDark-lowEmphasis" component="body2" truncateLines={1}>
                        {spot.location.streetNumber} {spot.location.streetName}
                    </Typography>
                )}
            </div>
            <div className="shrink-0 flex flex-col max-w-[24%] my-auto ml-4 overflow-hidden">
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
        </div>
    );
};
