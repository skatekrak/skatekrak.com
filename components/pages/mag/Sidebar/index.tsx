import React from 'react';

import Nav from 'components/pages/mag/Sidebar/Nav';
import ScrollTop from 'components/Ui/Utils/ScrollTop';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};
const Sidebar: React.SFC<Props> = ({ sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h2 className="feed-sidebar-header-title">Krak mag</h2>
            <img src="https://res.skatekrak.com/static/krakmag_logo.png" alt="Krak mag" id="krakmag-logo" />
            <p className="feed-sidebar-header-text">Articles, updtaes, interview everything from the mag just here</p>
        </div>
        <Nav sidebarNavIsOpen={sidebarNavIsOpen} handleOpenSidebarNav={handleOpenSidebarNav} />
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
