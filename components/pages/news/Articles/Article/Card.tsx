import { distanceInWordsToNow } from 'date-fns';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import Truncate from 'react-truncate';
import { Content } from 'rss-feed';

import BackgroundLoader from 'components/Ui/Utils/BackgroundLoader';

type Props = {
    content: Content;
};

type State = { isCopied: boolean };

class Card extends React.PureComponent<Props, State> {
    public state: State = {
        isCopied: false,
    };

    public render() {
        const { content } = this.props;

        return (
            <>
                <a href={this.getArticleUrl(content)} className="news-article-link" target="_blank" rel="noreferrer">
                    <div className="news-article-cover-img-container">
                        <BackgroundLoader
                            className="news-article-cover-img"
                            src={this.getImage(content)}
                            placeholder={this.getPlaceholder(content)}
                        />
                    </div>
                    <h2 className="news-article-title">{content.title}</h2>
                </a>
                <div className="news-article-details">
                    <div className="news-article-details-source">
                        by
                        <a
                            href={this.getWebsiteUrl(content)}
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
                <div>
                    <FacebookShareButton url={this.getArticleUrl(content)}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={this.getArticleUrl(content)}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    {this.state.isCopied ? 'Lien copié' : ''}
                    <input type="text" defaultValue={this.getArticleUrl(content)} onClick={this.copyToClipboard} />
                </div>
            </>
        );
    }

    private copyToClipboard = (event: React.MouseEvent<HTMLInputElement>): void => {
        event.currentTarget.setSelectionRange(0, event.currentTarget.value.length);
        document.execCommand('copy');
        this.setState({ isCopied: true });
    };

    private getImage(content: Content): string {
        if (content.media && content.media.url) {
            return `${process.env.CACHING_URL}/${encodeURIComponent(content.media.url)}`;
        }
        return null;
    }

    private getPlaceholder(content: Content): string {
        return `${process.env.CACHING_URL}/${encodeURIComponent(content.source.coverUrl)}`;
    }

    private getArticleUrl(content: Content): string {
        return `${process.env.REDIRECT_URL}/${encodeURIComponent(content.webUrl)}`;
    }

    private getWebsiteUrl(content: Content): string {
        return `${process.env.REDIRECT_URL}/${encodeURIComponent(content.source.website)}`;
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

export default Card;
