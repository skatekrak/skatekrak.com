import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import classNames from 'classnames';

import IconArrow from '@/components/Ui/Icons/Arrow';
import { useCustomMapID, useCityID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import Content from '@/components/pages/map/MapCustom/panel/Content';
import { CustomMap } from '@/lib/map/types';
import { Spot } from '@krak/carrelage-client';
import MapCustomMediaCarousel from '@/components/pages/map/MapCustom/MapCustomMediaCarousel';
import ScrollBar from '@/components/Ui/Scrollbar';
import { useInfiniteMedias } from '@/shared/feudartifice/hooks/media';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from 'react-infinite-scroller';

export type MapCustomPanelTabs = 'media' | 'video' | 'spots';

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

    const { isLoading, isFetchingNextPage, data, hasNextPage, fetchNextPage } = useInfiniteMedias({
        hashtag: id,
    });
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

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

    return (
        <>
            {mediaId && <MapCustomMediaCarousel initialMediaId={mediaId} hashtag={id} />}
            <div
                className={classNames(
                    'absolute inset-0 lg:right-auto lg:w-[32rem] flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-[1010] overflow-y-auto',
                    { 'bottom-auto': !isOpen },
                )}
            >
                <ScrollBar maxHeight="100%">
                    <InfiniteScroll
                        pageStart={1}
                        initialLoad={false}
                        hasMore={hasNextPage}
                        useWindow={false}
                        getScrollParent={getScrollParent}
                        loadMore={() => {
                            console.log('load more');
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
                                    Reduce details
                                </button>
                            ) : (
                                <button className="flex items-center gap-3 text-base" onClick={() => setIsOpen(true)}>
                                    <NextImage
                                        className="rounded-full"
                                        src={`/images/map/custom-maps/${id}.png`}
                                        width={32}
                                        height={32}
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
                                    <NextImage
                                        className="mx-auto rounded-full"
                                        src={`/images/map/custom-maps/${id}.png`}
                                        width={120}
                                        height={120}
                                        alt="custom map profile picture"
                                        priority={true}
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
                                    <>
                                        {/** Tabs */}
                                        <div className="flex gap-6 justify-center flex-wrap my-8 px-6">
                                            {medias && medias.length > 0 && (
                                                <Tab
                                                    title="media"
                                                    onClick={() => setOpenTab('media')}
                                                    isActive={openTab === 'media'}
                                                />
                                            )}
                                            {map.videos && map.videos?.length > 0 && (
                                                <Tab
                                                    title="video"
                                                    onClick={() => setOpenTab('video')}
                                                    isActive={openTab === 'video'}
                                                />
                                            )}
                                            {spots.length > 0 && (
                                                <Tab
                                                    title="spots"
                                                    onClick={() => setOpenTab('spots')}
                                                    isActive={openTab === 'spots'}
                                                />
                                            )}
                                        </div>
                                        <div className="grow flex flex-col gap-6 px-6 pb-8">
                                            <Content
                                                activeTab={openTab}
                                                spots={spots}
                                                medias={medias ?? []}
                                                videos={map.videos}
                                            />
                                            {isFetchingNextPage && <KrakLoading />}
                                        </div>
                                    </>
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

export const Tab = ({
    title,
    isActive,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { title: string; isActive: boolean }) => (
    <button
        className={classNames(
            'relative pt-1 pb-3 px-4 text-lg font-bold hover:text-onDark-highEmphasis',
            {
                'text-onDark-highEmphasis': isActive,
            },
            className,
        )}
        {...props}
    >
        {title}
        {isActive && <div className="absolute -bottom-0.5 inset-x-2 h-0.5 bg-primary-100" />}
    </button>
);
