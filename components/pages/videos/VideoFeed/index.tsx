import axios from 'axios';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';

import TrackedPage from 'components/pages/TrackedPage';
import FeaturedVideo from 'components/pages/videos/VideoFeed/Video/FeaturedVideo';
import VideoCard from 'components/pages/videos/VideoFeed/Video/VideoCard';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';
import { feedEndRefresh } from 'store/feed/actions';
import { getFilters } from 'store/feed/reducers';
import { RootState } from 'store/reducers';
import { Video } from 'rss-feed';
import useVideos from 'lib/hook/videos/videos';

type VideoFeedProps = {
    sidebarNavIsOpen: boolean;
};

const VideoFeed = ({ sidebarNavIsOpen }: VideoFeedProps) => {
    const dispatch = useDispatch();
    const sources = useSelector((state: RootState) => state.video.sources);
    const search = useSelector((state: RootState) => state.video.search);
    const feedNeedRefresh = useSelector((state: RootState) => state.video.feedNeedRefresh);

    const [featuredVideo, setFeaturedVideo] = useState<Video>();

    const filters = getFilters(sources);
    const { data, isFetching, canFetchMore, fetchMore } = useVideos({ filters, query: search });

    const displayedVideos = (data ?? []).reduce((acc, val) => acc.concat(val), []);

    useEffect(() => {
        if (!isFetching) {
            dispatch(feedEndRefresh());
        }
    }, [isFetching, dispatch]);

    useEffect(() => {
        (async () => {
            const req: Promise<any> = axios.get(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/videos/featured`);
            const res = await req;
            if (res.data) {
                const data: Video[] = res.data;
                if (data.length > 0) {
                    setFeaturedVideo(data[0]);
                }
            }
        })();
    }, []);

    return (
        <div id="videos-feed-container">
            {featuredVideo && (
                <div id="videos-feed-header" className="row">
                    <div className="col-xs-12">
                        <FeaturedVideo video={featuredVideo} />
                    </div>
                </div>
            )}
            <TrackedPage name={`Videos/${Math.ceil(displayedVideos.length / 20)}`} initial={false} />
            <InfiniteScroll
                key={`infinite-need-refresh-${feedNeedRefresh}`}
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (canFetchMore) {
                        fetchMore();
                    }
                }}
                hasMore={!isFetching && canFetchMore}
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
                    {displayedVideos.length > 0 && !canFetchMore && (
                        <NoContent title="No more video" desc="Select other channels if you're still hungry" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default VideoFeed;
