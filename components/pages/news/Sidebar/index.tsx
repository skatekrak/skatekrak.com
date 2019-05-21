import React from 'react';

import Nav from 'components/pages/news/Sidebar/Nav';
import Emoji from 'components/Ui/Icons/Emoji';
import ScrollTop from 'components/Ui/Utils/ScrollTop';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};
const Sidebar: React.SFC<Props> = ({ sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h1 className="feed-sidebar-header-title" data-name="news-sidebar-title">
                Our daily dose of
                <br />
                skateboarding news
                <span className="feed-sidebar-header-subtitle">
                    [<Emoji symbol="🐙" label="Kraken" /> <Emoji symbol="📰" label="newspaper" />]
                </span>
            </h1>
        </div>
        <Nav navIsOpen={sidebarNavIsOpen} handleOpenSourcesMenu={handleOpenSidebarNav} />
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
