import * as React from 'react';
import Truncate from 'react-truncate';
import { Content } from 'types/Content';

type Props = {
    content: Content;
};

type State = {};

class Article extends React.PureComponent<Props, State> {
    public render() {
        const { content } = this.props;

        return (
            <div className="news-article col-xs-12 col-sm-6 col-lg-3">
                <a href={content.webUrl} className="news-article-link">
                    <div className="news-article-cover-img-container">
                        <div
                            style={{ backgroundImage: `url(${content.imageUrl})` }}
                            className="news-article-cover-img"
                        />
                    </div>
                    <h2 className="news-article-title">{content.title}</h2>
                </a>
                <div className="news-article-details">
                    <div className="news-article-details-source">
                        by
                        <a href={content.source.webUrl} className="news-article-details-source-link">
                            <img src="" alt="" className="news-article-details-source-logo" />
                            <span className="news-article-details-source-name">{content.source.label}</span>
                        </a>
                    </div>
                    <span className="news-article-details-date">&nbsp;- 9h ago</span>
                </div>
                <p className="news-article-desc">
                    <Truncate lines={4} ellipsis="...">
                        {content.content}
                    </Truncate>
                </p>
            </div>
        );
    }
}

export default Article;
