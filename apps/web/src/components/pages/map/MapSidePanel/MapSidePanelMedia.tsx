import { useInfiniteQuery } from '@tanstack/react-query';

import type { Media, Spot } from '@krak/contracts';

import MapMedia from '@/components/pages/map/media/MapMedia';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import { orpc } from '@/server/orpc/client';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

const pageSize = 50;

type MediaCursor = Pick<Media, 'createdAt' | 'id'>;

type MapSidePanelMediaProps = {
    bounds?: MapBounds;
    onSpotClick: (spot: Spot) => void;
};

export const MapSidePanelMedia = ({ bounds, onSpotClick }: MapSidePanelMediaProps) => {
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        ...orpc.media.list.infiniteOptions({
            input: (cursor: MediaCursor | undefined) => ({
                bounds,
                limit: pageSize,
                cursor: cursor?.createdAt,
                cursorId: cursor?.id,
            }),
            initialPageParam: undefined as MediaCursor | undefined,
            getNextPageParam: (lastPage) =>
                lastPage.length < pageSize
                    ? undefined
                    : { createdAt: lastPage.at(-1)!.createdAt, id: lastPage.at(-1)!.id },
        }),
        enabled: bounds != null,
    });
    const medias = data?.pages.flat() ?? [];

    if (bounds == null) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">Zoom in to explore media.</p>;
    }

    if (isLoading) {
        return <KrakLoading className="mx-auto my-12" />;
    }

    if (medias.length === 0) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">No media in this area.</p>;
    }

    return (
        <InfiniteScroll hasMore={hasNextPage} isLoading={isFetchingNextPage} loadMore={() => fetchNextPage()}>
            <div className="flex flex-col gap-6 pt-6">
                {medias.map((media) => (
                    <MapMedia
                        key={media.id}
                        media={media}
                        isFromCustomMapFeed
                        onSpotClick={onSpotClick}
                        showFullscreen={false}
                    />
                ))}
                {isFetchingNextPage && <KrakLoading className="mx-auto" />}
            </div>
        </InfiniteScroll>
    );
};
