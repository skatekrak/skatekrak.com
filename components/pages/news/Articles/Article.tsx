import { distanceInWordsToNow } from 'date-fns';
import * as React from 'react';
import Truncate from 'react-truncate';
import { Content } from 'rss-feed';

type Props = {
    content: Content;
};

type State = {};

class Article extends React.PureComponent<Props, State> {
    public render() {
        const { content } = this.props;

        return (
            <div className="news-article col-xs-12 col-sm-6 col-lg-3">
                <a href={content.webUrl} className="news-article-link" target="_blank" rel="noreferrer">
                    <div className="news-article-cover-img-container">
                        <div
                            style={{ backgroundImage: `url(${this.getImageUrl(content)})` }}
                            className="news-article-cover-img"
                        />
                    </div>
                    <h2 className="news-article-title">{content.title}</h2>
                </a>
                <div className="news-article-details">
                    <div className="news-article-details-source">
                        by
                        <a
                            href={content.source.website}
                            className="news-article-details-source-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            &nbsp;
                            <span className="news-article-details-source-name">{content.source.label}</span>
                        </a>
                    </div>
                    <span className="news-article-details-date">&nbsp;- {distanceInWordsToNow(content.createdAt)}</span>
                </div>
                <p className="news-article-desc">
                    <Truncate lines={4} ellipsis="...">
                        {this.getContent(content)}
                    </Truncate>
                </p>
            </div>
        );
    }

    private getImageUrl(content: Content): string {
        if (content.media && content.media.url) {
            return content.media.url;
        }
        return content.source.coverUrl;
    }

    private getContent(content: Content): string {
        if (content.summary) {
            return content.summary;
        } else if (content.content) {
            return content.content;
        }
        return null;
    }
}

export default Article;
