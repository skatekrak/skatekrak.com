import classNames from 'classnames';
import * as React from 'react';

import Article from 'components/pages/news/Articles/Article';

type Props = {
    sourcesMenuIsOpen: boolean;
};

const Articles: React.SFC<Props> = ({ sourcesMenuIsOpen }) => (
    <div id="news-articles-container" className="col-xs-12 col-md-8 col-lg-9">
        <div
            className={classNames('row', {
                hide: sourcesMenuIsOpen,
            })}
        >
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
