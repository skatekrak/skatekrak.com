import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Article from 'components/pages/news/Articles/Article';
import { Content } from 'types/Content';

type Props = {
    sourcesMenuIsOpen: boolean;
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

    public render() {
        const { sourcesMenuIsOpen } = this.props;
        const { contents, isLoading, hasMore } = this.state;

        return (
            <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
                <InfiniteScroll
                    pageStart={0}
                    initialLoad={true}
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
        try {
            this.setState({ isLoading: true });
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/feeds/`, { params: { page } });
            const data: Content[] = res.data;
            const contents = this.state.contents;
            await this.sleep(2000);
            this.setState({
                contents: contents.concat(data),
                hasMore: data.length >= 20,
            });
        } catch (err) {
            //
        } finally {
            this.setState({ isLoading: false });
        }
    };

    private async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }
}

export default Articles;
