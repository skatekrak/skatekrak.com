import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Article from 'components/pages/news/Articles/Article';
import Loading from 'components/pages/news/Articles/Loading';
import NoMore from 'components/pages/news/Articles/NoMore';
import TrackedPage from 'components/pages/TrackedPage';
import ScrollHelper from 'lib/ScrollHelper';
import Thread from 'lib/Thread';
import { Content, Source } from 'rss-feed';
import { feedEndRefresh, FilterState, State as NewsState } from 'store/reducers/news';

type Props = {
    sourcesMenuIsOpen: boolean;
    news: NewsState;
    dispatch: (fct: any) => void;
};

type State = {
    contents: Content[];
    isLoading: boolean;
    hasMore: boolean;
};

class Articles extends React.Component<Props, State> {
    public state: State = {
        contents: [],
        isLoading: false,
        hasMore: true,
    };

    public async componentDidUpdate() {
        if (this.props.news.feedNeedRefresh && !this.state.isLoading) {
            this.setState({ contents: [], hasMore: false });
            await this.loadMore(1);
        }
    }

    public render() {
        const { sourcesMenuIsOpen } = this.props;
        const { contents, isLoading, hasMore } = this.state;

        return (
            <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
                <InfiniteScroll
                    key={`infinite-need-refresh-${this.props.news.feedNeedRefresh}`}
                    pageStart={1}
                    initialLoad={false}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={ScrollHelper.getScrollContainer}
                    useWindow={false}
                >
                    <div className={classNames('row', { hide: sourcesMenuIsOpen })}>
                        {contents.length === 0 && !isLoading && (
                            <div id="news-articles-no-content">
                                <p id="news-articles-no-content-title">No news to display</p>
                                <p id="news-articles-no-content-text">Select some mags to be back in the loop</p>
                            </div>
                        )}
                        {contents.map((content) => (
                            <Article key={content.id} content={content} />
                        ))}
                        {isLoading && <Loading />}
                        {contents.length > 0 && !hasMore && <NoMore />}

                        <TrackedPage name={`News/${Math.ceil(contents.length / 20)}`} initial={false} />
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

    private getFilters(sources: Map<Source, FilterState>): string[] {
        const arr: string[] = [];
        for (const entry of sources.entries()) {
            if (entry[1] === FilterState.LOADING_TO_SELECTED || entry[1] === FilterState.SELECTED) {
                arr.push(entry[0].id);
            }
        }
        return arr;
    }
}

export default connect((state: any) => ({ news: state.news }))(Articles);
