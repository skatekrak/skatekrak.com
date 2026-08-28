import { useInfiniteQuery } from '@tanstack/react-query';

import type { Spot } from '@krak/contracts';

import MapSearchResultSpot from '@/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import { orpc } from '@/server/orpc/client';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

const pageSize = 50;

type MapSidePanelSpotsProps = {
    bounds?: MapBounds;
    onSpotClick: (spot: Spot) => void;
};

export const MapSidePanelSpots = ({ bounds, onSpotClick }: MapSidePanelSpotsProps) => {
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
            <div className="flex flex-col pt-4">
                {spots.map((spot) => (
                    <MapSearchResultSpot key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                ))}
                {isFetchingNextPage && <KrakLoading className="mx-auto mt-4" />}
            </div>
        </InfiniteScroll>
    );
};
