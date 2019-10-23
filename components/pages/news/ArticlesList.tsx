import React from 'react';

import Article from 'components/pages/news/Articles/Article';

import Content from 'models/Content';

type Props = {
    contents: Content[];
    promoCardIndexes: number[];
};

const ArticlesList = ({ contents, promoCardIndexes }: Props) => {
    const articles = contents.map(content => <Article key={content.id} content={content} />);
    for (const index of promoCardIndexes) {
        if (index < articles.length) {
            articles.splice(index, 0, <Article key={`ksc-card-${index}`} isClubPromotion />);
        }
    }

    return <>{articles}</>;
};

export default React.memo(ArticlesList);
