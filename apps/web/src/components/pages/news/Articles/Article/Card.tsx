import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import Truncate from 'react-truncate';

import Content from '@/models/Content';

import BackgroundLoader from '@/components/Ui/Utils/BackgroundLoader';
import SocialShare from '@/components/Ui/share/SocialShare';

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
            <SocialShare
                url={content.getArticlePopupUrl()}
                facebookQuote={`${content.title} shared via skatekrak.com`}
                twitterTitle={content.title}
            />
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
                    <span className="news-article-details-source-name">{content.source.shortTitle}</span>
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
