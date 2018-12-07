import * as React from 'react';

import Article from 'components/pages/news/Articles/Article';

const Articles: React.SFC = () => (
    <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
        <div className="row">
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
            <Article />
        </div>
    </div>
);

export default Articles;
