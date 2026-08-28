import NextImage from 'next/image';
import React, { useState } from 'react';

import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import ScrollBar from '@/components/Ui/Scrollbar';
import cities from '@/data/cities/_cities';
import { useCityID } from '@/lib/hook/queryState';
import { City } from '@/lib/map/types';

const pageSize = 3;

const CityPanel = () => {
    const [id, setCityID] = useCityID();

    const city: City | undefined = cities.find((c) => c.id === id);

    const [pagination, setPagination] = useState({ cityId: id, count: pageSize });

    if (!city) return null;

    const visibleCount = pagination.cityId === id ? pagination.count : pageSize;
    const hasMore = visibleCount < city.videos.length;

    return (
        <div className="absolute inset-0 laptop-s:right-auto laptop-s:w-[32rem] flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-[1010] overflow-y-auto">
            <ScrollBar maxHeight="100%">
                {/** Navigation */}
                <div className="flex justify-between py-3 px-6 border-b border-solid border-b-onDark-divider">
                    <span className="font-medium">{city.name}</span>
                    <button className="-mr-2 py-1 px-2 hover:text-onDark-highEmphasis" onClick={() => setCityID(null)}>
                        Close
                    </button>
                </div>
                {/** City profile */}
                <NextImage
                    height={192}
                    width={511}
                    src={`/images/map/cities/${city.id}-cover.jpg`}
                    alt={`${city.name} landscape`}
                    className="bg-onDark-divider"
                />
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
                    <div className="grow flex flex-col gap-4 mobile:gap-8 px-4 mobile:px-6 pb-8">
                        {city.videos.slice(0, visibleCount).map((video, index) => (
                            <VideoPlayer key={index} url={video} controls />
                        ))}
                    </div>
                </InfiniteScroll>
            </ScrollBar>
        </div>
    );
};

export default CityPanel;
