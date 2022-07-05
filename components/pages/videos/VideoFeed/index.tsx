import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';

import TrackedPage from 'components/pages/TrackedPage';
import FeaturedVideo from 'components/pages/videos/VideoFeed/Video/FeaturedVideo';
import VideoCard from 'components/pages/videos/VideoFeed/Video/VideoCard';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';
import { RootState } from 'store';
import useVideos from 'lib/hook/videos/videos';
import useFeaturedVideos from 'lib/hook/videos/featured';
import { flatten } from 'lib/helpers';

type VideoFeedProps = {
    sidebarNavIsOpen: boolean;
};

const VideoFeed = ({ sidebarNavIsOpen }: VideoFeedProps) => {
    const selectSources = useSelector((state: RootState) => state.video.selectSources);
    const search = useSelector((state: RootState) => state.video.search);

    const { data, isFetching, hasNextPage, fetchNextPage } = useVideos({ filters: selectSources, query: search });
    const displayedVideos = flatten(data?.pages ?? []);

    return (
        <div id="videos-feed-container">
            <TrackedPage name={`Videos/${Math.ceil(displayedVideos.length / 20)}`} initial={false} />
            <InfiniteScroll
                key={`infinite-need-refresh`}
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={!isFetching && hasNextPage}
                getScrollParent={ScrollHelper.getScrollContainer}
                useWindow={false}
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
