import Link from 'next/link';
import React from 'react';

const ArticleAd = () => (
    <div className="news-article-club">
        <img
            className="news-article-club-illustration"
            src="/images/news-article-club-illustration.svg"
            alt="Krak club illustration"
        />
        <div className="news-article-club-cta-container">
            <p className="news-article-club-cta-text">Join the community</p>
            <Link href="/">
                <a className="news-article-club-cta">Discover</a>
            </Link>
        </div>
    </div>
);

export default ArticleAd;
