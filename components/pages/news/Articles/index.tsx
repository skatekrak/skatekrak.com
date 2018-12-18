import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Article from 'components/pages/news/Articles/Article';
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
            this.setState({ contents: [], hasMore: true });
            await this.loadMore(1);
        }
    }

    public render() {
        const { sourcesMenuIsOpen } = this.props;
        const { contents, isLoading, hasMore } = this.state;

        return (
            <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
                <InfiniteScroll
                    key={'infinite-need-refresh-' + this.props.news.feedNeedRefresh}
                    pageStart={1}
                    initialLoad={false}
                    loadMore={this.loadMore}
                    hasMore={!isLoading && hasMore}
                    getScrollParent={this.getScrollParent}
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
                        {isLoading && <div key="loader">Loading ...</div>}
                        {contents.length > 0 && !hasMore && <div key="no-more">No More ...</div>}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

    private getScrollParent = () => {
        return document.getElementById('main-container');
    };

    private loadMore = async (page: number) => {
        console.log(`Page: ${page}`);
        try {
            const filters = this.getFilters(this.props.news.sources);
            console.log(`Filters: ${filters.length}`);
            if (filters.length === 0) {
                return;
            }
            this.setState({ isLoading: true });
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/feeds/`, { params: { page, filters } });
            const data: Content[] = res.data;
            const contents = this.state.contents;
            this.setState({
                contents: contents.concat(data),
                hasMore: data.length >= 20,
            });
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
