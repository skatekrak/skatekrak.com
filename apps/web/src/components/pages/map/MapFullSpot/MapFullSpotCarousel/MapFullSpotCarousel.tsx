import { useQuery } from '@tanstack/react-query';

import type { Media, Spot } from '@krak/contracts';

import { Carousel } from '@/components/pages/map/_components';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import { useCustomMapID, useMediaTab } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';

type Props = {
    initialMediaId: string;
    spot: Spot;
};

const MapFullSpotCarousel = ({ initialMediaId, spot }: Props) => {
    const { data: media, isLoading: mediaLoading } = useQuery(
        orpc.media.getById.queryOptions({
            input: { id: initialMediaId },
            placeholderData: (prev) => prev,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }),
    );

    return (
        <div className="absolute inset-0 flex z-10">
            {mediaLoading && <KrakLoading />}
            {!mediaLoading && media != null && <MapFullSpotCarouselContent spot={spot} media={media} />}
        </div>
    );
};

const MapFullSpotCarouselContent = ({ spot, media }: { spot: Spot; media: Media }) => {
    const [customMapId] = useCustomMapID();
    const [activeTab] = useMediaTab(customMapId ? 'map' : 'all');

    const { data } = useQuery(
        orpc.media.getSpotMediasAround.queryOptions({
            input: {
                spotId: spot.id,
                mediaCreatedAt: media.createdAt,
                hashtag: customMapId && activeTab === 'map' ? customMapId : undefined,
                excludeHashtag: customMapId && activeTab === 'all' ? customMapId : undefined,
            },
        }),
    );

    return <Carousel media={media} prevMedia={data?.prevMedia ?? null} nextMedia={data?.nextMedia ?? null} />;
};

export default MapFullSpotCarousel;
