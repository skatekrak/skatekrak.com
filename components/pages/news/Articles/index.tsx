import axios from 'axios';
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

import Content from 'models/Content';
import ArticlesList from '../ArticlesList';
import { RootState } from 'store/reducers';

type ArticlesProps = {
    sidebarNavIsOpen: boolean;
};

const Articles = ({ sidebarNavIsOpen }: ArticlesProps) => {
    const news = useSelector((state: RootState) => state.news);
    const feedLayout = useSelector((state: RootState) => state.settings.feedLayout);
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(false);
    const [contents, setContents] = useState<Content[]>([]);
    const [hasMore, setHasMore] = useState(false);
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

    const loadMore = useCallback(
        async (page: number) => {
            try {
                setLoading(true);

                const filters = getFilters(news.sources);
                if (filters.length === 0) {
                    return Promise.resolve();
                }

                const res = await axios.get(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents/`, {
                    params: {
                        page,
                        filters,
                        query: news.search,
                    },
                });

                if (res.data) {
                    const data: Content[] = res.data.map((content) => new Content(content));
                    setContents((contents) => contents.concat(data));
                    setHasMore(data.length >= 20);
                }
            } catch (err) {
                //
            } finally {
                dispatch(feedEndRefresh());
                setLoading(false);
            }
        },
        [dispatch, news.sources, news.search],
    );

    useEffect(() => {
        if (news.feedNeedRefresh && !isLoading) {
            setContents([]);
            setHasMore(false);
            loadMore(1);
        }
    }, [news.feedNeedRefresh, isLoading, loadMore]);

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
                loadMore={loadMore}
                hasMore={!isLoading && hasMore}
                getScrollParent={ScrollHelper.getScrollContainer}
                useWindow={false}
            >
                <div className={classNames('row', { hide: sidebarNavIsOpen })}>
                    {contents.length === 0 && !isLoading && (
                        <NoContent title="No news to display" desc="Select some mags to be back in the loop" />
                    )}

                    <ArticlesList contents={contents} promoCardIndexes={promoCardIndexes} />

                    {isLoading && <KrakLoading />}
                    {contents.length > 0 && !hasMore && (
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
