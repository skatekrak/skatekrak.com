import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';

import NoContent from '@/components/Ui/Feed/NoContent';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import ScrollHelper from '@/lib/ScrollHelper';
import { FeedLayout, useSettingsStore } from '@/store/settings';

import ArticlesList from '../ArticlesList';
import { RootState } from '@/store';
import useNewsContent from '@/lib/hook/news/contents';
import { flatten } from '@/lib/helpers';

type ArticlesProps = {
    sidebarNavIsOpen: boolean;
};

const Articles = ({ sidebarNavIsOpen }: ArticlesProps) => {
    const selectedSources = useSelector((state: RootState) => state.news.selectSources);
    const feedLayout = useSettingsStore((state) => state.feedLayout);

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

    const { data, isFetching, hasNextPage, fetchNextPage } = useNewsContent({
        sources: selectedSources,
    });
    const contents = flatten(data?.pages ?? []);

    useEffect(() => {
        if (feedLayout && promoCardIndexes.length === 0) {
            genClubPromotionIndexes();
        }
    }, [feedLayout, promoCardIndexes, genClubPromotionIndexes]);

    return (
        <div id="news-articles-container">
            <InfiniteScroll
                key={`infinite-need-refresh`}
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
                    {contents.length === 0 && !isFetching && (
                        <NoContent title="No news to display" desc="Select some mags to be back in the loop" />
                    )}

                    <ArticlesList contents={contents} promoCardIndexes={promoCardIndexes} />

                    {isFetching && <KrakLoading />}
                    {contents.length > 0 && !hasNextPage && (
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
