import React from 'react';

import LatestPosts from 'components/pages/mag/Sidebar/LatestPosts';
import Nav from 'components/pages/mag/Sidebar/Nav';
import RelatedPosts from 'components/pages/mag/Sidebar/RelatedPosts';
import ScrollTop from 'components/Ui/Utils/ScrollTop';
import { Post } from '../Feed';

type Props = {
    post?: Post;
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};
const Sidebar = ({ post, sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h2 className="feed-sidebar-header-title">Krak mag</h2>
            <img src="https://res.skatekrak.com/static/krakmag_logo.png" alt="Krak mag" className="krakmag-logo" />
        </div>
        {post ? (
            <>
                <RelatedPosts post={post} />
                <LatestPosts />
            </>
        ) : (
            <Nav sidebarNavIsOpen={sidebarNavIsOpen} handleOpenSidebarNav={handleOpenSidebarNav} />
        )}
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default Sidebar;
