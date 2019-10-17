import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Types from 'Types';

import Card from 'components/pages/mag/Feed/Card';
import TrackedPage from 'components/pages/TrackedPage';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import { formatPost } from 'lib/formattedPost';
import ScrollHelper from 'lib/ScrollHelper';
import { Source } from 'rss-feed';
import { feedEndRefresh } from 'store/feed/actions';
import { State as MagState } from 'store/feed/reducers';

export interface Post {
    id?: number;
    title?: { rendered?: string };
    slug?: string;
    link?: string;
    date?: string;
    content?: { rendered?: string };
    excerpt?: { rendered?: string };
    featured_media?: number;
    thumbnailImage?: string;
    featuredImageFull?: string;
    _format_video_embed?: string;
    categories?: any[];
    categoriesString?: string;
    _embedded?: object;
}

type Props = {
    mag: MagState;
    dispatch: (fct: any) => void;
    sidebarNavIsOpen: boolean;
};

type State = {
    isLoading: boolean;
    hasMore: boolean;
    posts: Post[];
};

class Feed extends React.Component<Props, State> {
    private static getFilters(sources: Map<Source, FilterState>): string[] {
        const arr: string[] = [];
        for (const entry of sources.entries()) {
            if (entry[1] === FilterState.LOADING_TO_SELECTED || entry[1] === FilterState.SELECTED) {
                arr.push(entry[0].id);
            }
        }
        return arr;
    }

    public state: State = {
        isLoading: false,
        hasMore: true,
        posts: [],
    };

    public async componentDidUpdate(_prevProps: Props, prevState: State) {
        if (this.props.mag.feedNeedRefresh && !this.state.isLoading) {
            this.setState({ posts: [], hasMore: false });
            await this.loadMore(1);
        }
        if (this.state.posts.length > 0 && this.state.posts.length > prevState.posts.length) {
            Analytics.default().trackLinks();
        }
    }

    public render() {
        const { isLoading, hasMore, posts } = this.state;

        return (
            <div id="mag-feed">
                <TrackedPage name={`Mag/${Math.ceil(posts.length / 20)}`} initial={false} />
                <InfiniteScroll
                    pageStart={1}
                    initialLoad={false}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={this.getScrollContainer}
                    useWindow={false}
                >
                    <div className={classNames('row', { hide: this.props.sidebarNavIsOpen })}>
                        {posts.map(post => (
                            <div key={post.id} className="mag-card-container col-xs-12 col-sm-6 col-lg-4">
                                <Card post={post} />
                            </div>
                        ))}
                        {isLoading && <KrakLoading />}
                        {posts.length === 0 && !isLoading && (
                            <NoContent
                                title="No article to display"
                                desc="Select some categories to be back in the loop"
                            />
                        )}
                        {posts.length > 0 && !hasMore && (
                            <NoContent title="No more article" desc="Add more categories" />
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

            const filters = Feed.getFilters(this.props.mag.sources);

            if (filters.length === 0) {
                return Promise.resolve();
            }

            const params = { per_page: 20, page, categories: filters, search: this.props.mag.search, _embed: 1 };
            const res = await axios.get(`${getConfig().publicRuntimeConfig.KRAKMAG_URL}/wp-json/wp/v2/posts`, {
                params: {
                    ...params,
                    search: this.props.mag.search,
                },
            });

            if (res.data) {
                const formattedPosts = res.data.map(post => formatPost(post));
                const posts = this.state.posts;
                this.setState({
                    posts: posts.concat(formattedPosts),
                    hasMore: formattedPosts.length >= 20,
                });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.props.dispatch(feedEndRefresh());
            this.setState({ isLoading: false });
        }
    };
}

export default connect(({ mag }: Types.RootState) => ({
    mag,
}))(Feed);
