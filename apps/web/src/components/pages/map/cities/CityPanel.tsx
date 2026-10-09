import { useQuery } from '@tanstack/react-query';
import NextImage from 'next/image';
import { useCallback, useMemo, useState } from 'react';

import type { Spot } from '@krak/contracts';

import { BoundedMediaFeed, BoundedSpotFeed, MapOverlayPanel } from '@/components/pages/map/_components';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';
import { useCityID, useSpotID } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

const pageSize = 3;

type CityPanelTab = 'video' | 'media' | 'spots';

const toMapBounds = (bounds: [[number, number], [number, number]]): MapBounds => {
    const [[longitude1, latitude1], [longitude2, latitude2]] = bounds;

    return {
        northEast: {
            latitude: Math.max(latitude1, latitude2),
            longitude: Math.max(longitude1, longitude2),
        },
        southWest: {
            latitude: Math.min(latitude1, latitude2),
            longitude: Math.min(longitude1, longitude2),
        },
    };
};

const CityPanel = () => {
    const [id, setCityID] = useCityID();
    const [, setSpotID] = useSpotID();
    const { data: cities = [] } = useQuery(orpc.cities.list.queryOptions({}));

    const city = cities.find((c) => c.id === id);

    const [pagination, setPagination] = useState({ cityId: id, count: pageSize });
    const [tabs, setTabs] = useState<{ cityId: string | null; tab: CityPanelTab }>({ cityId: id, tab: 'video' });

    const bounds = useMemo(() => (city ? toMapBounds(city.bounds) : undefined), [city]);
    const openTab = tabs.cityId === id ? tabs.tab : 'video';

    const onSpotClick = useCallback(
        (spot: Spot) => {
            setSpotID(spot.id);
        },
        [setSpotID],
    );

    if (!city || id == null) return null;

    const visibleCount = pagination.cityId === id ? pagination.count : pageSize;
    const hasMore = visibleCount < city.videos.length;

    return (
        <MapOverlayPanel>
            <MapOverlayPanel.Header>
                <span className="font-medium text-onDark-highEmphasis">{city.name}</span>
                <button className="-mr-2 py-1 px-2 hover:text-onDark-highEmphasis" onClick={() => setCityID(null)}>
                    Close
                </button>
            </MapOverlayPanel.Header>
            <MapOverlayPanel.Body>
                <ScrollBar maxHeight="100%">
                    <NextImage
                        height={192}
                        width={511}
                        src={`/images/map/cities/${city.id}-cover.jpg`}
                        alt={`${city.name} landscape`}
                        className="bg-onDark-divider"
                    />
                    <div className="flex flex-col gap-4 mt-8 mb-6 px-6">
                        <h2 className="font-bold text-2xl text-center text-onDark-highEmphasis">{city.name}</h2>
                        {city.about && (
                            <p id="map-custom-panel-about" className="text-sm text-center">
                                {city.about}
                            </p>
                        )}
                    </div>
                    <Tabs
                        value={openTab}
                        onValueChange={(tab) => setTabs({ cityId: id, tab })}
                        className="flex flex-col"
                    >
                        <Tabs.List className="sticky top-0 z-10 shrink-0 pt-2 px-6 bg-tertiary-dark">
                            <Tabs.Tab value="video">Video</Tabs.Tab>
                            <Tabs.Tab value="media">Media</Tabs.Tab>
                            <Tabs.Tab value="spots">Spots</Tabs.Tab>
                        </Tabs.List>
                        <div className="px-4 mobile:px-6 pb-8">
                            <Tabs.Content value="video">
                                <InfiniteScroll
                                    loadMore={() => {
                                        setPagination((current) => ({
                                            cityId: id,
                                            count: Math.min(
                                                (current.cityId === id ? current.count : pageSize) + pageSize,
                                                city.videos.length,
                                            ),
                                        }));
                                    }}
                                    hasMore={hasMore}
                                >
                                    <div className="flex flex-col gap-4 mobile:gap-8 pt-6">
                                        {city.videos.slice(0, visibleCount).map((video) => (
                                            <VideoPlayer key={video} url={video} controls />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            </Tabs.Content>
                            <Tabs.Content value="media">
                                <BoundedMediaFeed bounds={bounds} onSpotClick={onSpotClick} />
                            </Tabs.Content>
                            <Tabs.Content value="spots">
                                <BoundedSpotFeed bounds={bounds} onSpotClick={onSpotClick} />
                            </Tabs.Content>
                        </div>
                    </Tabs>
                </ScrollBar>
            </MapOverlayPanel.Body>
        </MapOverlayPanel>
    );
};

export default CityPanel;
