import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';

import Card from 'components/pages/mag/Feed/Card';
import TrackedPage from 'components/pages/TrackedPage';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';
import { RootState } from 'store/reducers';

import usePosts from 'lib/hook/mag/posts';

type Props = {
    sidebarNavIsOpen: boolean;
};

const Feed = ({ sidebarNavIsOpen }: Props) => {
    const mag = useSelector((state: RootState) => state.mag);
    const categories = Object.keys(mag.categories);

    const { data, isFetching, canFetchMore, fetchMore } = usePosts({
        per_page: 20,
        categories,
    });

    // Flatten the posts list
    const posts = (data ?? []).reduce((acc, val) => acc.concat(val), []);

    return (
        <div id="mag-feed">
            <TrackedPage name={`Mag/${Math.ceil(posts.length / 20)}`} initial={false} />
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (canFetchMore) {
                        fetchMore();
                    }
                }}
                hasMore={canFetchMore}
                getScrollParent={ScrollHelper.getScrollContainer}
                useWindow={false}
            >
                <div className={classNames('row', { hide: sidebarNavIsOpen })}>
                    {posts.map((post) => (
                        <div key={post.id} className="mag-card-container col-xs-12 col-sm-6 col-lg-4">
                            <Card post={post} />
                        </div>
                    ))}
                    {isFetching && <KrakLoading />}
                    {posts.length === 0 && !isFetching && (
                        <NoContent title="No article to display" desc="Select some categories to be back in the loop" />
                    )}
                    {posts.length > 0 && !canFetchMore && (
                        <NoContent title="No more article" desc="Add more categories" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Feed;
