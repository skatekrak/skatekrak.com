import React from 'react';

import Content from 'models/Content';

import Ad from 'components/pages/news/Articles/Article/Ad';
import Card from 'components/pages/news/Articles/Article/Card';
import createPropsGetter from 'lib/getProps';

type Props = {
    content?: Content;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    isClubPromotion: false,
};

const getProps = createPropsGetter(defaultProps);

const Article = (rawProps: Props) => {
    const props = getProps(rawProps);

    const { content, isClubPromotion } = props;

    return (
        <div className="news-article col-xs-12 col-sm-6 col-lg-3">
            {!isClubPromotion && content != null ? <Card content={content} /> : <Ad />}
        </div>
    );
};

export default React.memo(Article);
