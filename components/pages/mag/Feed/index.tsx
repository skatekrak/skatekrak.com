import axios from 'axios';
import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import TrackedPage from 'components/pages/TrackedPage';

import Card from 'components/pages/mag/Feed/Card';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';

export interface Post {
    id?: number;
    title?: {
        rendered?: string;
    };
    slug?: string;
    link?: string;
    date?: string;
    content?: {
        rendered?: string;
    };
    featured_media?: number;
    thumbnailImage?: string;
    featuredImageFull?: string;
    _format_video_embed?: string;
    categories?: any[];
    categoriesString?: string;
    _embedded?: object;
}

type Props = {
    sidebarNavIsOpen: boolean;
};

type State = {
    posts?: Post[];
    page: number;
    isLoading: boolean;
    hasMore: boolean;
};

class Feed extends React.Component<Props, State> {
    public state: State = {
        posts: [],
        page: 1,
        isLoading: false,
        hasMore: true,
    };

    public async componentDidMount() {
        await this.loadMore();
    }

    public render() {
        const { posts, isLoading, hasMore } = this.state;

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
                        {posts.length !== 0 &&
                            posts.map((post) => (
                                <div key={post.id} className="mag-card-container col-xs-12 col-sm-6 col-lg-4">
                                    <Card post={post} />
                                </div>
                            ))}
                        {isLoading && <KrakLoading />}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

    private loadMore = async () => {
        this.setState({ isLoading: true });

        try {
            let req: Promise<any>;
            if (this.state.posts.length !== 0) {
                req = axios.get(
                    `https://mag.skatekrak.com/wp-json/wp/v2/posts?per_page=20&before=${this.state.posts[this.state.posts.length - 1].date}&_embed`,
                );
            } else {
                req = axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/posts?per_page=20&page=1&_embed`);
            }
            const res = await req;

            if (res.data) {
                const data: Post[] = res.data;
                const formatedPosts = await this.getFormatedPosts(data);
                const posts = this.state.posts;
                this.setState({
                    posts: posts.concat(formatedPosts),
                });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({
                isLoading: false,
                page: this.state.page += 1,
            });
        }
    };

    private getFormatedPosts = async (posts: Post[]) => {
        const formatedPosts = [];

        for (const post of posts) {
            // Get formated categories
            if (post.categories) {
                const categories = post._embedded['wp:term'][0];
                let formatedCategories = '';
                for (let iCategory = 0; iCategory < categories.length; iCategory++) {
                    const categoryName = categories[iCategory].name;
                    formatedCategories += categoryName;
                    if (iCategory !== categories.length - 1) {
                        formatedCategories += ', ';
                    }
                }
                post.categoriesString = formatedCategories;
            }

            // Get image
            if (post.featured_media) {
                const thumbnailImage = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                post.thumbnailImage = thumbnailImage;
            }

            formatedPosts.push(post);
        }

        return formatedPosts;
    };

    private getScrollContainer = () => {
        return ScrollHelper.getScrollContainer();
    };
}

export default Feed;
