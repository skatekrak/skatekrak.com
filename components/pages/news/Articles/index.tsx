import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';

import TrackedPage from 'components/pages/TrackedPage';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollHelper from 'lib/ScrollHelper';
import { feedEndRefresh } from 'store/feed/actions';
import { getFilters } from 'store/feed/reducers';
import { FeedLayout } from 'store/settings/reducers';

import ArticlesList from '../ArticlesList';
import { RootState } from 'store/reducers';
import useNewsContent from 'lib/hook/news/contents';

type ArticlesProps = {
    sidebarNavIsOpen: boolean;
};

const Articles = ({ sidebarNavIsOpen }: ArticlesProps) => {
    const news = useSelector((state: RootState) => state.news);
    const feedLayout = useSelector((state: RootState) => state.settings.feedLayout);
    const dispatch = useDispatch();

    const [promoCardIndexes, setPromoCardIndexes] = useState<number[]>([]);

    const genClubPromotionIndexes = useCallback(() => {
        const indexes: number[] = [];
        for (let i = 0; i < 20; i++) {
            let range = 0;
            switch (feedLayout) {
                case FeedLayout.OneColumn:
                    range = 40;
                    break;
                case FeedLayout.TwoColumns:
                    range = 70;
                    break;
                case FeedLayout.FourColumns:
                    range = 100;
                    break;
            }
            const minBound = i * range + range * (1 / 3);
            const maxBound = (i + 1) * range - range * (1 / 3);
            indexes.push(getRandomInt(minBound, maxBound));
        }
        setPromoCardIndexes(indexes);
    }, [setPromoCardIndexes, feedLayout]);

    const filters = getFilters(news.sources);
    const { data, isFetching, canFetchMore, fetchMore } = useNewsContent({
        filters,
        query: news.search,
    });
    const contents = (data ?? []).reduce((acc, val) => acc.concat(val), []);

    useEffect(() => {
        if (!isFetching) {
            dispatch(feedEndRefresh());
        }
    }, [isFetching, dispatch]);

    useEffect(() => {
        if (feedLayout && promoCardIndexes.length === 0) {
            genClubPromotionIndexes();
        }
    }, [feedLayout, promoCardIndexes, genClubPromotionIndexes]);

    return (
        <div id="news-articles-container">
            <TrackedPage name={`News/${Math.ceil(contents.length / 20)}`} initial={false} />
            <InfiniteScroll
                key={`infinite-need-refresh-${news.feedNeedRefresh}`}
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
                    {contents.length === 0 && !isFetching && (
                        <NoContent title="No news to display" desc="Select some mags to be back in the loop" />
                    )}

                    <ArticlesList contents={contents} promoCardIndexes={promoCardIndexes} />

                    {isFetching && <KrakLoading />}
                    {contents.length > 0 && !canFetchMore && (
                        <NoContent title="No more news" desc="Add more mags or start your own ;)" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

export default Articles;
