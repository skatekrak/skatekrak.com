import React from 'react';

type Props = {
    title: string;
    desc: string;
};

const NoContent: React.SFC<Props> = ({ title, desc }) => (
    <div key="no-more" className="feed-no-content col-xs-12">
        <p className="feed-no-content-title">{title}</p>
        <p className="feed-no-content-text">{desc}</p>
    </div>
);

export default NoContent;
