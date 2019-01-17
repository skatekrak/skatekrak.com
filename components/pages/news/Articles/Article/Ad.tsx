import React from 'react';

const ArticleAd: React.SFC = () => (
    <div className="news-article-club">
        <img
            className="news-article-club-illustration"
            src="/static/images/news-article-club-illustration.svg"
            alt="Krak club illustration"
        />
        <div className="news-article-club-cta-container">
            <p className="news-article-club-cta-text">29$/month</p>
            <a className="news-article-club-cta" href="/club">
                Discover
            </a>
        </div>
    </div>
);

export default ArticleAd;
