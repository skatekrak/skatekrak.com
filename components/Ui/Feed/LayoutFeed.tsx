import React from 'react';
import classNames from 'classnames';

type Props = {
    mainView: React.ReactNode;
    sidebar?: React.ReactNode;
};

const LayoutFeed = ({ mainView, sidebar }: Props) => (
    <div className="container-fluid">
        <div className="row">
            {sidebar != null && <div className="feed-sidebar col-xs-12 last-md col-md-4 col-lg-3">{sidebar}</div>}
            <div
                className={classNames('col-xs-12', {
                    'col-md-8 col-lg-9': sidebar != null,
                    'col-md-12 col-lg-12': sidebar == null,
                })}
            >
                {mainView}
            </div>
        </div>
    </div>
);

export default LayoutFeed;
