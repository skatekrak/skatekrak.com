import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Types from 'Types';

import Article from 'components/pages/news/Articles/Article';
import TrackedPage from 'components/pages/TrackedPage';
import NoContent from 'components/Ui/Feed/NoContent';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import ScrollHelper from 'lib/ScrollHelper';
import { Content, Source } from 'rss-feed';
import { feedEndRefresh } from 'store/feed/actions';
import { State as NewsState } from 'store/feed/reducers';
import { FeedLayout } from 'store/settings/reducers';

type Props = {
    news: NewsState;
    feedLayout: FeedLayout;
    dispatch: (fct: any) => void;
    payment: any;
    sidebarNavIsOpen: boolean;
};

type State = {
    contents: Content[];
    promoCardIndexes: number[];
    isLoading: boolean;
    hasMore: boolean;
};

class Articles extends React.Component<Props, State> {
    public state: State = {
        contents: [],
        promoCardIndexes: [],
        isLoading: false,
        hasMore: true,
    };

    public async componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.news.feedNeedRefresh && !this.state.isLoading) {
            this.setState({ contents: [], hasMore: false });
            await this.loadMore(1);
        }
        if (this.props.feedLayout && this.state.promoCardIndexes.length === 0) {
            this.genClubPromotionIndexes();
        }
        if (this.state.contents.length > 0 && this.state.contents.length > prevState.contents.length) {
            Analytics.default().trackLinks();
        }
    }

    public render() {
        const { contents, isLoading, hasMore } = this.state;

        return (
            <div id="news-articles-container">
                <TrackedPage name={`News/${Math.ceil(contents.length / 20)}`} initial={false} />
                <InfiniteScroll
                    key={`infinite-need-refresh-${this.props.news.feedNeedRefresh}`}
                    pageStart={1}
                    initialLoad={false}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={this.getScrollContainer}
                    useWindow={false}
                >
                    <div className={classNames('row', { hide: this.props.sidebarNavIsOpen })}>
                        {contents.length === 0 && !isLoading && (
                            <NoContent title="No news to display" desc="Select some mags to be back in the loop" />
                        )}

                        {this.genArticlesList(contents)}

                        {isLoading && <KrakLoading />}
                        {contents.length > 0 && !hasMore && (
                            <NoContent title="No more news" desc="Add more mags or start your own ;)" />
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

    private loadMore = async (page: number) => {
        try {
            this.setState({ isLoading: true });

            const filters = this.getFilters(this.props.news.sources);
            if (filters.length === 0) {
                return Promise.resolve();
            }

            const params = { page, filters };
            const res = await axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/contents/`, {
                params: {
                    ...params,
                    search: this.props.news.search,
                },
            });

            if (res.data) {
                const data: Content[] = res.data;
                const contents = this.state.contents;
                this.setState({
                    contents: contents.concat(data),
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

    private getScrollContainer = () => {
        return ScrollHelper.getScrollContainer();
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

    private genClubPromotionIndexes(): void {
        const indexes: number[] = [];
        for (let i = 0; i < 20; i++) {
            let range = 0;
            switch (this.props.feedLayout) {
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
        this.setState({ promoCardIndexes: indexes });
    }

    private genArticlesList(contents: Content[]): JSX.Element[] {
        const articles = contents.map(content => (
            <Article key={content.id} content={content} currency={this.props.payment.currency} />
        ));
        for (const index of this.state.promoCardIndexes) {
            if (index < articles.length) {
                articles.splice(
                    index,
                    0,
                    <Article key={`ksc-card-${index}`} isClubPromotion currency={this.props.payment.currency} />,
                );
            }
        }
        return articles;
    }
}

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

export default connect(({ news, settings, payment }: Types.RootState) => ({
    news,
    feedLayout: settings.feedLayout,
    payment,
}))(Articles);
