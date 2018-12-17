import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';

import Article from 'components/pages/news/Articles/Article';
import { Content } from 'types/Content';

type Props = {
    sourcesMenuIsOpen: boolean;
};

type State = {
    contents: Content[];
};

class Articles extends React.PureComponent<Props, State> {
    public state: State = {
        contents: [],
    };

    public async componentDidMount() {
        try {
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/feeds/`, {
                params: {
                    page: 1,
                },
            });
            const contents: Content[] = res.data;
            this.setState({ contents });
        } catch (err) {
            //
        }
    }

    public render() {
        const { sourcesMenuIsOpen } = this.props;
        const { contents } = this.state;

        return (
            <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
                <div
                    className={classNames('row', {
                        hide: sourcesMenuIsOpen,
                    })}
                >
                    {contents.length === 0 && (
                        <div id="news-articles-no-content">
                            <p id="news-articles-no-content-title">No news to display</p>
                            <p id="news-articles-no-content-text">Select some mags to be back in the loop</p>
                        </div>
                    )}
                    {contents.map((content) => (
                        <Article key={content.id} content={content} />
                    ))}
                </div>
            </div>
        );
    }
}

export default Articles;
