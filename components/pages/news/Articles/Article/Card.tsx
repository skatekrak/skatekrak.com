import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import getConfig from 'next/config';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import Truncate from 'react-truncate';
import { Content } from 'rss-feed';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import BackgroundLoader from 'components/Ui/Utils/BackgroundLoader';

type Props = {
    content: Content;
};

const Card = ({ content }: Props) => {
    const getImage = (): string => {
        if (content.media && content.media.url) {
            return `${getConfig().publicRuntimeConfig.CACHING_URL}/${encodeURIComponent(content.media.url)}`;
        }
        return null;
    };

    const getPlaceholder = (): string => {
        return content.source.coverUrl;
    };

    const getArticleUrl = (): string => {
        return `${getConfig().publicRuntimeConfig.REDIRECT_URL}/${encodeURIComponent(content.webUrl)}`;
    };

    const getArticlePopupUrl = (): string => {
        return `${window.location.origin}/news?id=${content.id}`;
    };

    const getWebsiteUrl = (): string => {
        return `${getConfig().publicRuntimeConfig.REDIRECT_URL}/${encodeURIComponent(content.source.website)}`;
    };

    const getContent = (): string => {
        if (content.summary) {
            return content.summary;
        } else if (content.content) {
            return content.content;
        }
        return null;
    };

    return (
        <>
            <a href={getArticleUrl()} className="news-article-link" target="_blank" rel="noreferrer">
                <div className="news-article-cover-img-container">
                    <BackgroundLoader
                        className="news-article-cover-img"
                        src={getImage()}
                        placeholder={getPlaceholder()}
                    />
                </div>
                <h2 className="news-article-title">{content.title}</h2>
            </a>
            <div className="news-article-share">
                <FacebookShareButton url={getArticlePopupUrl()} quote={`${content.title} shared via skatekrak.com`}>
                    <FacebookIcon size={24} round />
                </FacebookShareButton>
                <TwitterShareButton url={getArticlePopupUrl()} title={content.title} via="skatekrak">
                    <TwitterIcon size={24} round />
                </TwitterShareButton>
                <ClipboardButton value={getArticlePopupUrl()} />
            </div>
            <div className="news-article-details">
                <div className="news-article-details-source">
                    by
                    <a
                        href={getWebsiteUrl()}
                        className="news-article-details-source-link"
                        target="_blank"
                        rel="noreferrer"
                    >
                        &nbsp;
                        <span className="news-article-details-source-name">{content.source.label}</span>
                    </a>
                </div>
                <span className="news-article-details-date">
                    &nbsp;- {formatDistanceToNow(parseISO(content.createdAt))}
                </span>
            </div>
            <p className="news-article-desc">
                <Truncate lines={4} ellipsis="...">
                    {getContent()}
                </Truncate>
            </p>
        </>
    );
};

export default Card;
