import * as React from 'react';
import Truncate from 'react-truncate';

type Props = {
    title: string;
    img: string;
    desc: string;
    url: string;
    source: {
        id: string;
        name: string;
        url: string;
    };
};

const Article: React.SFC<Props> = ({ title, img, desc, url, source }) => (
    <div className="news-article col-xs-12 col-sm-6 col-lg-3">
        <a href={url} className="news-article-link">
            <div className="news-article-cover-img-container">
                <div style={{ backgroundImage: `url(${img})` }} className="news-article-cover-img" />
            </div>
            <h2 className="news-article-title">{title}</h2>
        </a>
        <div className="news-article-details">
            <div className="news-article-details-source">
                by
                <a href={source.url} className="news-article-details-source-link">
                    <img src="" alt="" className="news-article-details-source-logo" />
                    <span className="news-article-details-source-name">{source.name}</span>
                </a>
            </div>
            <span className="news-article-details-date">&nbsp;- 9h ago</span>
        </div>
        <p className="news-article-desc">
            <Truncate lines={4} ellipsis="...">
                {desc}
            </Truncate>
        </p>
    </div>
);

export default Article;
