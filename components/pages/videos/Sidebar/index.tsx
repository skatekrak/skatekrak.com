import React from 'react';

import YoutubeSubscribe from 'components/Ui/Button/YoutubeSubscribe';
import Emoji from 'components/Ui/Icons/Emoji';
import ScrollTop from 'components/Ui/Utils/ScrollTop';

const Sidebar: React.SFC = () => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h1 className="feed-sidebar-header-title">
                We all need our weekly dose{' '}
                <span className="feed-sidebar-header-subtitle">
                    [at least] <Emoji symbol="🐙" label="Kraken" /> <Emoji symbol="📺" label="television" />
                </span>
            </h1>
            <p className="feed-sidebar-header-text">
                We love filming skateboarding. Period. We make things for skateboarders and with these products, our
                community of riders is exploring the world out there.
            </p>
            <YoutubeSubscribe />
        </div>
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
