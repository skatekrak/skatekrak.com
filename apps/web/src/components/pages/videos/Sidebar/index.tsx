import React from 'react';

import Nav from '@/components/pages/videos/Sidebar/Nav';
import YoutubeSubscribe from '@/components/Ui/Button/YoutubeSubscribe';
import Emoji from '@/components/Ui/Icons/Emoji';
import ScrollTop from '@/components/Ui/Utils/ScrollTop';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};
const Sidebar: React.FC<Props> = ({ sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h1 className="feed-sidebar-header-title">
                We all need
                <br />
                our weekly dose{' '}
                <span className="feed-sidebar-header-subtitle">
                    [at least] <Emoji symbol="🐙" label="Kraken" /> <Emoji symbol="📺" label="television" />
                </span>
            </h1>
            <YoutubeSubscribe />
        </div>
        <Nav navIsOpen={sidebarNavIsOpen} handleOpenSourcesMenu={handleOpenSidebarNav} />
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
