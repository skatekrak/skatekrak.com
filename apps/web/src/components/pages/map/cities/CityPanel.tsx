import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';

import ScrollBar from '@/components/Ui/Scrollbar';
import { useCityID } from '@/lib/hook/queryState';
import cities from '@/data/cities/_cities';
import { City } from '@/lib/map/types';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from 'react-infinite-scroller';

const generatePages = (videos: string[], pageSize: number) => {
    const pages: string[][] = [];
    for (let i = 0; i < videos.length; i += pageSize) {
        pages.push(videos.slice(i, i + pageSize));
    }
    return pages;
};

const getScrollParent = () => {
    const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
    return wrappers[wrappers.length - 1] as HTMLElement;
};

const CityPanel = () => {
    const [id, setCityID] = useCityID();

    const city: City | undefined = cities.find((city) => city.id === id);

    const [isLoading, setIsLoading] = useState(false);

    const pages = generatePages(city?.videos ?? [], 3);

    const [currentPage, setCurrentPage] = useState(0);

    const hasNextPage = currentPage < pages.length - 1;

    const [displayedVideos, setDisplayedVideos] = useState(pages[0]);

    const loadMore = () => {
        if (!isLoading && currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
            setDisplayedVideos(displayedVideos.concat(pages[currentPage + 1]));
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setCurrentPage(0);
        setDisplayedVideos(pages[0]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!city) return null;

    return (
        <div className="absolute inset-0 lg:right-auto lg:w-[32rem] flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-[1010] overflow-y-auto">
            <ScrollBar maxHeight="100%">
                {/** Navigation */}
                <div className="flex justify-between py-3 px-6 border-b border-solid border-b-onDark-divider">
                    <span className="font-medium">{city.name}</span>
                    <button className="-mr-2 py-1 px-2 hover:text-onDark-highEmphasis" onClick={() => setCityID(null)}>
                        Close
                    </button>
                </div>
                {/** City profile */}
                {isLoading ? (
                    <div className="h-[192px] bg-onDark-divider" />
                ) : (
                    <NextImage
                        height={192}
                        width={511}
                        src={`/images/map/cities/${city.id}-cover.jpg`}
                        alt={`${city.name} landscape`}
                        className="bg-onDark-divider"
                    />
                )}
                <div className="flex flex-col gap-4 my-8 px-6">
                    <h2 className="font-bold text-2xl text-center text-onDark-highEmphasis">{city.name}</h2>
                    {city.about && (
                        <p id="map-custom-panel-about" className="text-sm text-center">
                            {city.about}
                        </p>
                    )}
                </div>
                <div className="flex h-[1px] w-4/5 mt-8 mb-10 mx-auto bg-onDark-divider" />
                <InfiniteScroll
                    loadMore={() => hasNextPage && loadMore()}
                    hasMore={hasNextPage}
                    getScrollParent={getScrollParent}
                    useWindow={false}
                >
                    <div className="grow flex flex-col gap-4 sm:gap-8 px-4 sm:px-6 pb-8">
                        {isLoading ? (
                            <KrakLoading className="!my-24" />
                        ) : (
                            displayedVideos.map((video, index) => <VideoPlayer key={index} url={video} controls />)
                        )}
                    </div>
                </InfiniteScroll>
            </ScrollBar>
        </div>
    );
};

export default CityPanel;
