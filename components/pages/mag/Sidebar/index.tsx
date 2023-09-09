import Link from 'next/link';
import React from 'react';

import Nav from 'components/pages/mag/Sidebar/Nav';
import ScrollTop from 'components/Ui/Utils/ScrollTop';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};
const Sidebar = ({ sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h2 className="feed-sidebar-header-title">Krak mag</h2>
            <Link href="/mag">
                <img src="https://res.skatekrak.com/static/krakmag_logo.png" alt="Krak mag" className="krakmag-logo" />
            </Link>
        </div>
        <Nav sidebarNavIsOpen={sidebarNavIsOpen} handleOpenSidebarNav={handleOpenSidebarNav} />
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
