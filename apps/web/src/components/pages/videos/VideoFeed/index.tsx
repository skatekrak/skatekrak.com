import classNames from 'classnames';
import React from 'react';
import VideoCard from '@/components/pages/videos/VideoFeed/Video/VideoCard';
import NoContent from '@/components/Ui/Feed/NoContent';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import ScrollHelper from '@/lib/ScrollHelper';
import { useVideosStore } from '@/store/videos';
import useVideos from '@/lib/hook/videos/videos';
import { flatten } from '@/lib/helpers';

type VideoFeedProps = {
    sidebarNavIsOpen: boolean;
};

const VideoFeed = ({ sidebarNavIsOpen }: VideoFeedProps) => {
    const selectSources = useVideosStore((state) => state.selectSources);
    const search = useVideosStore((state) => state.search);

    const { data, isFetching, hasNextPage, fetchNextPage } = useVideos({ sources: selectSources, query: search });
    const displayedVideos = flatten(data?.pages ?? []);

    return (
        <div id="videos-feed-container">
            <InfiniteScroll
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={!isFetching && hasNextPage}
                getScrollParent={ScrollHelper.getScrollContainer}
            >
                <div className={classNames('row', { hide: sidebarNavIsOpen })}>
                    {displayedVideos.map((video, index) => (
                        <div key={index} className="video-card-container col-xs-12 col-sm-6 col-lg-4">
                            <VideoCard video={video} />
                        </div>
                    ))}
                    {displayedVideos.length === 0 && !isFetching && (
                        <NoContent title="No video to display" desc="Select some channels to be back in the loop" />
                    )}
                    {isFetching && <KrakLoading />}
                    {displayedVideos.length > 0 && !hasNextPage && (
                        <NoContent title="No more video" desc="Select other channels if you're still hungry" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default VideoFeed;
