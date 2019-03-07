import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Types from 'Types';

import Article from 'components/pages/news/Articles/Article';
import TrackedPage from 'components/pages/TrackedPage';
import Loading from 'components/Ui/Feed/Loading';
import NoContent from 'components/Ui/Feed/NoContent';
import ScrollHelper from 'lib/ScrollHelper';
import Thread from 'lib/Thread';
import { Content, Source } from 'rss-feed';
import { feedEndRefresh } from 'store/news/actions';
import { FilterState, State as NewsState } from 'store/news/reducers';
import { FeedLayout } from 'store/settings/reducers';

type Props = {
    sourcesMenuIsOpen: boolean;
    news: NewsState;
    feedLayout: FeedLayout;
    dispatch: (fct: any) => void;
    payment: any;
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
        const { sourcesMenuIsOpen } = this.props;
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
                    <div className={classNames('row', { hide: sourcesMenuIsOpen })}>
                        {contents.length === 0 && !isLoading && (
                            <NoContent title="No news to display" desc="Select some mags to be back in the loop" />
                        )}

                        {this.genArticlesList(contents)}

                        {isLoading && <Loading />}
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
            let req: Promise<any>;
            if (filters.length === 0) {
                req = Promise.resolve();
            } else {
                req = axios.get(`${process.env.RSS_BACKEND_URL}/feeds/`, { params: { page, filters } });
            }
            // Force minumum wait time of 150ms
            const [res] = await Promise.all([req, Thread.sleep(150)]);
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
            indexes.push(this.getRandomInt(minBound, maxBound));
        }
        this.setState({ promoCardIndexes: indexes });
    }

    private genArticlesList(contents: Content[]): JSX.Element[] {
        const articles = contents.map((content) => (
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

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export default connect(({ news, settings, payment }: Types.RootState) => ({
    news,
    feedLayout: settings.feedLayout,
    payment,
}))(Articles);
