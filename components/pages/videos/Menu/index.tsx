import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';
import ScrollTop from 'components/Ui/Utils/ScrollTop';
import YoutubeSubscribe from 'components/Ui/Button/YoutubeSubscribe';

const Menu: React.SFC = () => (
    <div id="videos-menu-container">
        <div id="videos-menu-desc">
            <h1 id="videos-menu-desc-title">
                We all need our weekly dose{' '}
                <span id="videos-menu-desc-subtitle">
                    [at least] <Emoji symbol="🐙" label="Kraken" /> <Emoji symbol="📺" label="television" />
                </span>
            </h1>
            <p id="videos-menu-desc-text">
                We love filming skateboarding. Period. We make things for skateboarders and with these products, our
                community of riders is exploring the world out there.
            </p>
            <YoutubeSubscribe />
        </div>
        <ScrollTop elementId="videos-menu-desc" />
    </div>
);

export default Menu;
