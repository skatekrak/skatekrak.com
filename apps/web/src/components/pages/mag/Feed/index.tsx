import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Card from '@/components/pages/mag/Feed/Card';
import NoContent from '@/components/Ui/Feed/NoContent';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import ScrollHelper from '@/lib/ScrollHelper';

import usePosts from '@/lib/hook/mag/posts';
import { flatten } from '@/lib/helpers';
import { useMagStore } from '@/store/mag';

type Props = {
    sidebarNavIsOpen: boolean;
};

const Feed = ({ sidebarNavIsOpen }: Props) => {
    const selectedCategories = useMagStore((state) => state.selectedCategories);

    const { data, isFetching, hasNextPage, fetchNextPage } = usePosts({
        per_page: 20,
        categories: selectedCategories,
    });

    // Flatten the posts list
    const posts = flatten(data?.pages ?? []);

    return (
        <div id="mag-feed">
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={hasNextPage}
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
                    {posts.length > 0 && !hasNextPage && (
                        <NoContent title="No more article" desc="Add more categories" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default Feed;
