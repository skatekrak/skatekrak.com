import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Types from 'Types';

import TrackedPage from 'components/pages/TrackedPage';
import FeaturedVideo from 'components/pages/videos/VideoFeed/Video/FeaturedVideo';
import VideoCard from 'components/pages/videos/VideoFeed/Video/VideoCard';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import ScrollHelper from 'lib/ScrollHelper';
import { Source, Video } from 'rss-feed';
import { feedEndRefresh } from 'store/video/actions';
import { State as VideoState } from 'store/video/reducers';

type Props = {
    video: VideoState;
    dispatch: (fct: any) => void;
    sidebarNavIsOpen: boolean;
};

type State = {
    isLoading: boolean;
    hasMore: boolean;
    featuredVideo?: Video;
    displayedVideos: Video[];
};

class VideoFeed extends React.Component<Props, State> {
    public state: State = {
        isLoading: false,
        hasMore: true,
        displayedVideos: [],
    };

    public async componentDidMount() {
        const req: Promise<any> = axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/videos/featured`);
        const res = await req;
        if (res.data) {
            const data: Video[] = res.data;
            this.getFeaturedVideo(data);
        }
    }

    public async componentDidUpdate(_prevProps: Props, prevState: State) {
        if (this.props.video.feedNeedRefresh && !this.state.isLoading) {
            this.setState({ displayedVideos: [], hasMore: false });
            await this.loadMore(1);
        }
        if (
            this.state.displayedVideos.length > 0 &&
            this.state.displayedVideos.length > prevState.displayedVideos.length
        ) {
            Analytics.default().trackLinks();
        }
    }

    public render() {
        const { isLoading, hasMore, featuredVideo, displayedVideos } = this.state;
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
                    key={`infinite-need-refresh-${this.props.video.feedNeedRefresh}`}
                    pageStart={1}
                    initialLoad={false}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={this.getScrollContainer}
                    useWindow={false}
                >
                    <div className={classNames('row', { hide: this.props.sidebarNavIsOpen })}>
                        {displayedVideos.map((video, index) => (
                            <div key={index} className="video-card-container col-xs-12 col-sm-6">
                                <VideoCard video={video} />
                            </div>
                        ))}
                        {displayedVideos.length === 0 && !isLoading && (
                            <NoContent title="No video to display" desc="Select some channels to be back in the loop" />
                        )}
                        {isLoading && <KrakLoading />}
                        {displayedVideos.length > 0 && !hasMore && (
                            <NoContent title="No more video" desc="Select other channels if you're still hungry" />
                        )}
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

            const filters = this.getFilters(this.props.video.sources);
            let req: Promise<any>;
            if (filters.length === 0) {
                req = Promise.resolve();
            } else {
                if (this.props.video.search) {
                    req = axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/videos/search`, {
                        params: { page, filters, query: this.props.video.search },
                    });
                } else {
                    req = axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/videos/`, {
                        params: { page, filters },
                    });
                }
            }
            const res = await req;
            if (res.data) {
                const data: Video[] = res.data;
                const displayedVideos = this.state.displayedVideos;
                this.setState({
                    displayedVideos: displayedVideos.concat(data),
                    hasMore: data.length >= 20,
                });
            }
        } catch (err) {
            //
        } finally {
            this.props.dispatch(feedEndRefresh());
            this.setState({ isLoading: false });
        }
    };

    private getFilters(sources: Map<Source, FilterState>): string[] {
        const arr: string[] = [];
        for (const entry of sources.entries()) {
            if (entry[1] === FilterState.LOADING_TO_SELECTED || entry[1] === FilterState.SELECTED) {
                arr.push(entry[0].id);
            }
        }
        return arr;
    }

    private getFeaturedVideo = (featuredVideos: Video[]) => {
        if (featuredVideos.length > 0) {
            this.setState({ featuredVideo: featuredVideos[0] });
        }
    };
}

export default connect(({ video }: Types.RootState) => ({
    video,
}))(VideoFeed);
