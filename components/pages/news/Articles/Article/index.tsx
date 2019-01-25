import React from 'react';
import { Content } from 'rss-feed';

import Ad from 'components/pages/news/Articles/Article/Ad';
import Card from 'components/pages/news/Articles/Article/Card';

type Props = {
    content?: Content;
    isClubPromotion?: boolean;
    currency: 'usd' | 'eur' | 'gbp';
};

class Article extends React.PureComponent<Props, {}> {
    public static defaultProps = {
        isClubPromotion: false,
    };

    public render() {
        const { content, isClubPromotion } = this.props;

        return (
            <div className="news-article col-xs-12 col-sm-6 col-lg-3">
                {!isClubPromotion ? <Card content={content} /> : <Ad currency={this.props.currency} />}
            </div>
        );
    }
}

export default Article;
