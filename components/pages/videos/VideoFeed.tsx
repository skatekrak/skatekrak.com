import axios from 'axios';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import TrackedPage from 'components/pages/TrackedPage';
import FeaturedVideo from 'components/pages/videos/FeaturedVideo';
import VideoCard from 'components/pages/videos/VideoCard';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';
import Thread from 'lib/Thread';
import { Video } from 'rss-feed';

type State = {
    isLoading: boolean;
    hasMore: boolean;
    featuredVideo?: Video;
    videos: Video[];
};

class VideoFeed extends React.Component<{}, State> {
    public state: State = {
        isLoading: false,
        hasMore: true,
        videos: [],
    };

    public async componentDidMount() {
        const req: Promise<any> = axios.get(`${process.env.RSS_BACKEND_URL}/videos/featured`);

        const [res] = await Promise.all([req, Thread.sleep(150)]);
        if (res.data) {
            const data: Video[] = res.data;
            this.getFeaturedVideo(data);
        }
    }

    public render() {
        const { isLoading, hasMore, featuredVideo, videos } = this.state;
        return (
            <div id="videos-feed-container">
                {featuredVideo && (
                    <div id="videos-feed-header" className="row">
                        <div className="col-xs-12">
                            <FeaturedVideo video={featuredVideo} />
                        </div>
                    </div>
                )}
                <TrackedPage name={`Videos/${Math.ceil(videos.length / 20)}`} initial={false} />
                <InfiniteScroll
                    pageStart={0}
                    initialLoad={true}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={this.getScrollContainer}
                    useWindow={false}
                >
                    <div className="row">
                        {videos.map((video, index) => (
                            <div key={index} className="video-card-container col-xs-12 col-sm-6 col-lg-4">
                                <VideoCard video={video} />
                            </div>
                        ))}

                        {isLoading && <KrakLoading />}
                        {videos.length > 0 && !hasMore && <NoContent title="No more video" desc="" />}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

    private getScrollContainer = () => {
        return ScrollHelper.getScrollContainer();
    };

    private loadMore = async (page: number) => {
        try {
            this.setState({ isLoading: true });

            const req: Promise<any> = axios.get(`${process.env.RSS_BACKEND_URL}/videos/`, { params: { page } });
            const [res] = await Promise.all([req, Thread.sleep(150)]);
            if (res.data) {
                const data: Video[] = res.data;
                const videos = this.state.videos;
                this.setState({
                    videos: videos.concat(data),
                    hasMore: data.length >= 20,
                });
            }
        } catch (err) {
            //
        } finally {
            this.setState({ isLoading: false });
        }
    };

    private getFeaturedVideo = (featuredVideos: Video[]) => {
        if (featuredVideos.length > 0) {
            this.setState({ featuredVideo: featuredVideos[0] });
        }
    };
}

export default VideoFeed;
