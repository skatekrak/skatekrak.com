import React from 'react';
import { Content } from 'rss-feed';

import Ad from 'components/pages/news/Articles/Article/Ad';
import Card from 'components/pages/news/Articles/Article/Card';

type Props = {
    content: Content;
    isAnAd: boolean;
};

const Article: React.SFC<Props> = ({ content, isAnAd }: Props) => (
    <div className="news-article col-xs-12 col-sm-6 col-lg-3">{!isAnAd ? <Card content={content} /> : <Ad />}</div>
);

export default Article;
