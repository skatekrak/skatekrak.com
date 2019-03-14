import React from 'react';

import 'static/styles/feed.styl';

type Props = {
    mainView: React.ReactNode;
    sidebar: React.ReactNode;
};

const LayoutFeed: React.SFC<Props> = ({ mainView, sidebar }) => (
    <div className="container-fluid">
        <div className="row">
            <div className="feed-sidebar col-xs-12 last-md col-md-4 col-lg-3">{sidebar}</div>
            <div className="col-xs-12 col-md-8 col-lg-9">{mainView}</div>
        </div>
    </div>
);

export default LayoutFeed;
