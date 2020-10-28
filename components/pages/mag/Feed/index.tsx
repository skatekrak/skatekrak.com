import axios from 'axios';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';

import Card from 'components/pages/mag/Feed/Card';
import TrackedPage from 'components/pages/TrackedPage';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import { formatPost } from 'lib/mag/formattedPost';
import ScrollHelper from 'lib/ScrollHelper';
import { Source } from 'rss-feed';
import { feedEndRefresh, setItems } from 'store/feed/actions';
import { RootState } from 'store/reducers';

export interface Post {
    id?: number;
    title?: { rendered?: string };
    slug?: string;
    link?: string;
    date?: string;
    date_gmt?: string;
    modified_gmt?: string;
    content?: { rendered?: string };
    excerpt?: { rendered?: string };
    featured_media?: number;
    thumbnailImage?: string;
    featuredImageFull?: string;
    _format_video_embed?: string;
    categories?: any[];
    categoriesString?: string;
    _embedded?: Record<string, any>;
}

type Props = {
    sidebarNavIsOpen: boolean;
};

const getFilters = (sources: Map<Source, FilterState>): string[] => {
    const arr: string[] = [];
    for (const entry of sources.entries()) {
        if (entry[1] === FilterState.LOADING_TO_SELECTED || entry[1] === FilterState.SELECTED) {
            arr.push(entry[0].id);
        }
    }
    return arr;
};

const Feed = ({ sidebarNavIsOpen }: Props) => {
    const [isLoading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);

    const mag = useSelector((state: RootState) => state.mag);
    const dispatch = useDispatch();

    const loadMore = useCallback(
        async (page: number) => {
            try {
                setLoading(true);

                const filters = getFilters(mag.sources);

                if (filters.length === 0) {
                    return Promise.resolve();
                }

                const params = { per_page: 20, page, categories: filters, search: mag.search, _embed: 1 };
                const res = await axios.get(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts`, {
                    params: {
                        ...params,
                        search: mag.search,
                    },
                });

                if (res.data) {
                    const formattedPosts = res.data.map((post) => formatPost(post));
                    setPosts((posts) => {
                        const _p = posts.concat(formattedPosts);
                        dispatch(setItems(_p));
                        return _p;
                    });
                    setHasMore(formattedPosts.length >= 20);
                }
            } catch (err) {
                // console.log(err);
            } finally {
                dispatch(feedEndRefresh());
                setLoading(false);
            }
        },
        [dispatch, mag.search, mag.sources],
    );

    useEffect(() => {
        if (mag.feedNeedRefresh && !isLoading) {
            setPosts([]);
            setHasMore(false);
            loadMore(1);
        }
    }, [mag.feedNeedRefresh, isLoading, loadMore]);

    return (
        <div id="mag-feed">
            <TrackedPage name={`Mag/${Math.ceil(posts.length / 20)}`} initial={false} />
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={loadMore}
                hasMore={!isLoading && hasMore}
                getScrollParent={ScrollHelper.getScrollContainer}
                useWindow={false}
            >
                <div className={classNames('row', { hide: sidebarNavIsOpen })}>
                    {posts.map((post) => (
                        <div key={post.id} className="mag-card-container col-xs-12 col-sm-6 col-lg-4">
                            <Card post={post} />
                        </div>
                    ))}
                    {isLoading && <KrakLoading />}
                    {posts.length === 0 && !isLoading && (
                        <NoContent title="No article to display" desc="Select some categories to be back in the loop" />
                    )}
                    {posts.length > 0 && !hasMore && <NoContent title="No more article" desc="Add more categories" />}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Feed;
