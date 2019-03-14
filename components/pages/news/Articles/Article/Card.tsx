import classNames from 'classnames';
import { distanceInWordsToNow } from 'date-fns';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import Truncate from 'react-truncate';
import { Content } from 'rss-feed';

import IconClipboard from 'components/Ui/Icons/Clipboard';
import BackgroundLoader from 'components/Ui/Utils/BackgroundLoader';

type Props = {
    content: Content;
};

type State = {
    isCopied: boolean;
    url: string;
};

class Card extends React.PureComponent<Props, State> {
    public state: State = {
        isCopied: false,
        url: '',
    };

    public componentDidMount() {
        this.setState({ url: this.props.content.webUrl });
    }

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
                <div className="news-article-share">
                    <FacebookShareButton url={this.getArticleUrl(content)}>
                        <FacebookIcon size={24} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={this.state.url}>
                        <TwitterIcon size={24} round />
                    </TwitterShareButton>
                    <button
                        className={classNames('news-article-share-clipboard', {
                            'news-article-share-clipboard--copied': this.state.isCopied,
                        })}
                        onClick={this.copyToClipboard}
                    >
                        <IconClipboard />
                        {this.state.isCopied ? 'Copied!' : ''}
                    </button>
                </div>
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
            </>
        );
    }

    private copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = this.state.url;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 1000);
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
