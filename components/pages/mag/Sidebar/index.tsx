import { Router, withRouter } from 'next/router';
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
    router: Router;
};
const Sidebar: React.SFC<Props> = ({ post, router, sidebarNavIsOpen, handleOpenSidebarNav }: Props) => (
    <div id="feed-scrolltop-hook" className="feed-sidebar-container">
        <div className="feed-sidebar-header">
            <h2 className="feed-sidebar-header-title">Krak mag</h2>
            <img src="https://res.skatekrak.com/static/krakmag_logo.png" alt="Krak mag" id="krakmag-logo" />
            <p className="feed-sidebar-header-text">Articles, updtaes, interview everything from the mag just here</p>
        </div>
        {!router.query.id ? (
            <Nav sidebarNavIsOpen={sidebarNavIsOpen} handleOpenSidebarNav={handleOpenSidebarNav} />
        ) : (
            <>
                {post && <RelatedPosts post={post} />}
                <LatestPosts />
            </>
        )}
        <p className="feed-sidebar-nav-main-request">
            You'd be down to contribute - email{' '}
            <a href="mailto:mag@skatekrak.com" className="feed-sidebar-nav-main-request-mail">
                news@skatekrak.com
            </a>
        </p>
        <ScrollTop elementId="feed-scrolltop-hook" />
    </div>
);

export default withRouter(Sidebar);
