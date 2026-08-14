import { useInfiniteQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import type { Spot } from '@krak/contracts';
import { KrakImage } from '@krak/ui';

import MapCustomMediaCarousel from '@/components/pages/map/MapCustom/MapCustomMediaCarousel';
import {
    MediaTabContent,
    SoundtrackTabContent,
    SpotsTabContent,
    VideoTabContent,
} from '@/components/pages/map/MapCustom/panel/Content';
import IconArrow from '@/components/Ui/Icons/Arrow';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';
import { useCityID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { CustomMap } from '@/lib/map/types';
import { orpc } from '@/server/orpc/client';

type MapCustomPanelTabs = 'media' | 'video' | 'spots' | 'soundtrack';

type MapCustomPanelProps = {
    map: CustomMap;
    spots: Spot[];
};

const MapCustomPanel = ({ map, spots }: MapCustomPanelProps) => {
    const { id, name, about, categories } = map;

    const [isOpen, setIsOpen] = useState(true);

    const [showReadMore, setShowReadMore] = useState(false);
    const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

    useEffect(() => {
        const aboutElement = document.getElementById('map-custom-panel-about');
        if (aboutElement && aboutElement.clientHeight >= 80) {
            setShowReadMore(true);
        }
    }, [id]);

    const [openTab, setOpenTab] = useState<MapCustomPanelTabs>('media');

    const [, setCustomMapID] = useCustomMapID();
    const [, setCityID] = useCityID();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCustomMapID(null);
        setCityID(null);
        setSpotID(null);
        setModalVisible(null);
    };

    const [mediaId] = useMediaID();
    const [spotModalVisible] = useSpotModal();

    const { isLoading, isFetching, isFetchingNextPage, data, hasNextPage, fetchNextPage } = useInfiniteQuery(
        orpc.media.list.infiniteOptions({
            input: (pageParam: Date | undefined) => ({ hashtag: id, limit: 20, cursor: pageParam }),
            initialPageParam: undefined as Date | undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.length < 20) return undefined;
                const lastElement = lastPage[lastPage.length - 1];
                return lastElement?.createdAt ?? undefined;
            },
            placeholderData: (prev) => prev,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }),
    );
    const medias = data?.pages.flatMap((page) => page) ?? [];

    useEffect(() => {
        if (!isLoading) {
            if (medias && medias.length > 0) {
                setOpenTab('media');
            } else {
                if (map.videos && map.videos.length > 0) {
                    setOpenTab('video');
                } else {
                    setOpenTab('spots');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    return (
        <>
            {mediaId && !spotModalVisible && <MapCustomMediaCarousel initialMediaId={mediaId} hashtag={id} />}
            <div
                className={classNames(
                    'absolute inset-0 laptop-s:right-auto laptop-s:w-lg flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-1010 overflow-y-auto',
                    { 'bottom-auto': !isOpen },
                )}
            >
                <ScrollBar maxHeight="100%">
                    <InfiniteScroll
                        hasMore={hasNextPage}
                        isLoading={isFetching}
                        loadMore={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                    >
                        {/** Navigation */}
                        <div className="flex justify-between py-4 px-6 border-b border-solid border-b-onDark-divider">
                            <a
                                className="group flex items-center gap-2 -ml-2 py-1 px-2 cursor-pointer"
                                onClick={goBack}
                            >
                                <IconArrow className="w-5 shrink-0 fill-onDark-mediumEmphasis group-hover:fill-onDark-highEmphasis rotate-180" />
                                <span className="whitespace-nowrap font-medium text-base group-hover:text-onDark-highEmphasis">
                                    Krak Map
                                </span>
                            </a>
                            {isOpen ? (
                                <button
                                    className="-mr-2 py-1 px-2 hover:text-onDark-highEmphasis"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Hide panel
                                </button>
                            ) : (
                                <button className="flex items-center gap-3 text-base" onClick={() => setIsOpen(true)}>
                                    <KrakImage
                                        className="rounded-full"
                                        path={`assets/maps/custom-maps/${id}.png`}
                                        options={{ width: 32, height: 32, resizingType: 'fill' }}
                                        alt="custom map profile picture"
                                    />
                                    <span className="font-bold text-onDark-highEmphasis">{name}</span>
                                </button>
                            )}
                        </div>

                        {/** Map profile */}
                        {isOpen && (
                            <>
                                <div className="flex flex-col pt-4 px-6">
                                    <span className="font-medium capitalize">{categories[0]}</span>
                                    <KrakImage
                                        className="mx-auto rounded-full"
                                        path={`assets/maps/custom-maps/${id}.png`}
                                        options={{ width: 120, height: 120, resizingType: 'fill' }}
                                        alt="custom map profile picture"
                                        loading="eager"
                                    />

                                    <h2 className="mt-4 font-bold text-2xl text-center text-onDark-highEmphasis">
                                        {name}
                                    </h2>

                                    {about && (
                                        <>
                                            <p
                                                id="map-custom-panel-about"
                                                className={classNames('mt-4 text-sm text-center', {
                                                    'line-clamp-4': !isReadMoreOpen,
                                                })}
                                            >
                                                {about}
                                            </p>
                                            {showReadMore && (
                                                <button
                                                    className="mt-1 mx-auto p-1 text-sm underline"
                                                    onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                                                >
                                                    {isReadMoreOpen ? 'Hide' : 'Read more'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

                                {isLoading ? (
                                    <div className="mx-auto my-32">
                                        <KrakLoading />
                                    </div>
                                ) : (
                                    <Tabs value={openTab} onValueChange={setOpenTab}>
                                        <Tabs.List className="my-8 px-6">
                                            {medias.length > 0 && <Tabs.Tab value="media">media</Tabs.Tab>}
                                            {map.videos?.length > 0 && <Tabs.Tab value="video">video</Tabs.Tab>}
                                            {spots.length > 0 && <Tabs.Tab value="spots">spots</Tabs.Tab>}
                                            {map.soundtrack.length > 0 && (
                                                <Tabs.Tab value="soundtrack">soundtrack</Tabs.Tab>
                                            )}
                                        </Tabs.List>
                                        <div className="grow px-6 pb-8">
                                            <Tabs.Content value="media" className="flex flex-col gap-6">
                                                <MediaTabContent medias={medias} />
                                            </Tabs.Content>
                                            <Tabs.Content value="video" className="flex flex-col gap-6">
                                                <VideoTabContent videos={map.videos} />
                                            </Tabs.Content>
                                            <Tabs.Content value="spots">
                                                <SpotsTabContent spots={spots} />
                                            </Tabs.Content>
                                            <Tabs.Content value="soundtrack">
                                                <SoundtrackTabContent soundtrack={map.soundtrack} />
                                            </Tabs.Content>
                                            {isFetchingNextPage && <KrakLoading />}
                                        </div>
                                    </Tabs>
                                )}
                            </>
                        )}
                    </InfiniteScroll>
                </ScrollBar>
            </div>
        </>
    );
};

export default MapCustomPanel;
