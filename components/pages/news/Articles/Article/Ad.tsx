import React from 'react';

import Link from 'components/Link';

const ArticleAd: React.SFC = () => (
    <div className="news-article-club">
        <img
            className="news-article-club-illustration"
            src="/static/images/news-article-club-illustration.svg"
            alt="Krak club illustration"
        />
        <div className="news-article-club-cta-container">
            <p className="news-article-club-cta-text">29$/month</p>
            <Link href="/club">
                <a className="news-article-club-cta">Discover</a>
            </Link>
        </div>
    </div>
);

export default ArticleAd;
