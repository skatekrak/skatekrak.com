import * as React from 'react';

const Article: React.SFC = () => (
    <div className="news-article col-xs-12 col-sm-6 col-lg-3">
        <a href="" className="news-article-link">
            <div className="news-article-cover-img-container">
                <div className="news-article-cover-img" />
            </div>
            <h2 className="news-article-title">Who Should be the 2018 Skater of the Year?</h2>
        </a>
        <div className="news-article-details">
            <div className="news-article-details-source">
                by
                <a href="" className="news-article-details-source-link">
                    <img src="" alt="" className="news-article-details-source-logo" />
                    <span className="news-article-details-source-name">Trasher Magazine</span>
                </a>
            </div>
            <span className="news-article-details-date">&nbsp;- 9h ago</span>
        </div>
        <p className="news-article-desc">
            Ride the Darkness? Listen up, ThrasheRadio is talking rad, again. Five years, fuck all the talkers, we hear
            the crucial tunes. —Jake Phelps
        </p>
    </div>
);

export default Article;
