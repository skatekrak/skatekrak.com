import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowDownWideNarrow } from 'lucide-react';

import type { Spot } from '@krak/contracts';

import MapSearchResultSpot from '@/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import Typography from '@/components/Ui/typography/Typography';
import { orpc } from '@/server/orpc/client';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

const pageSize = 20;

type MapExplorePanelSpotsProps = {
    bounds?: MapBounds;
    onSpotClick: (spot: Spot) => void;
};

export const MapExplorePanelSpots = ({ bounds, onSpotClick }: MapExplorePanelSpotsProps) => {
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        ...orpc.spots.listInBounds.infiniteOptions({
            input: (offset: number) => ({ ...bounds!, offset, limit: pageSize }),
            initialPageParam: 0,
            getNextPageParam: (lastPage, pages) => (lastPage.length < pageSize ? undefined : pages.length * pageSize),
        }),
        enabled: bounds != null,
    });
    const spots = data?.pages.flat() ?? [];

    if (bounds == null) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">Zoom in to explore spots.</p>;
    }

    if (isLoading) {
        return <KrakLoading className="mx-auto my-12" />;
    }

    if (spots.length === 0) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">No spots in this area.</p>;
    }

    return (
        <InfiniteScroll hasMore={hasNextPage} isLoading={isFetchingNextPage} loadMore={() => fetchNextPage()}>
            <div className="flex items-center gap-2 pt-6">
                <ArrowDownWideNarrow className="size-5 text-onDark-mediumEmphasis" />
                <Typography component="body1" className="text-onDark-mediumEmphasis">
                    most content
                </Typography>
            </div>
            <div className="flex flex-col gap-6 pt-4">
                {spots.map(({ spot, mediaThumbnail }) => (
                    <MapSearchResultSpot
                        key={spot.id}
                        spot={spot}
                        media={mediaThumbnail}
                        onSpotClick={onSpotClick}
                        display="card"
                    />
                ))}
                {isFetchingNextPage && <KrakLoading className="mx-auto mt-4" />}
            </div>
        </InfiniteScroll>
    );
};
