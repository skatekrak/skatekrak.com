import React from 'react';

import 'static/styles/feed.styl';

type Props = {
    mainView: React.ReactNode;
    sideBar: React.ReactNode;
};

const LayoutFeed: React.SFC<Props> = ({ mainView, sideBar }) => (
    <div className="container-fluid">
        <div className="row">
            <div className="feed-layout-sidebar col-xs-12 last-md col-md-4 col-lg-3">{sideBar}</div>
            <div className="col-xs-12 col-md-8 col-lg-9">{mainView}</div>
        </div>
    </div>
);

export default LayoutFeed;
