import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import Truncate from 'react-truncate';

import Content from 'models/Content';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import BackgroundLoader from 'components/Ui/Utils/BackgroundLoader';

type Props = {
    content: Content;
};

const Card = ({ content }: Props) => (
    <>
        <a href={content.getArticleUrl()} className="news-article-link" target="_blank" rel="noreferrer">
            <div className="news-article-cover-img-container">
                <BackgroundLoader
                    className="news-article-cover-img"
                    src={content.getImage()}
                    placeholder={content.getPlaceholder()}
                />
            </div>
            <h2 className="news-article-title">{content.title}</h2>
        </a>
        <div className="news-article-share">
            <FacebookShareButton url={content.getArticlePopupUrl()} quote={`${content.title} shared via skatekrak.com`}>
                <FacebookIcon size={24} round />
            </FacebookShareButton>
            <TwitterShareButton url={content.getArticlePopupUrl()} title={content.title} via="skatekrak">
                <TwitterIcon size={24} round />
            </TwitterShareButton>
            <ClipboardButton value={content.getArticlePopupUrl()} />
        </div>
        <div className="news-article-details">
            <div className="news-article-details-source">
                by
                <a
                    href={content.getWebsiteUrl()}
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
                {content.getContent()}
            </Truncate>
        </p>
    </>
);

export default Card;
