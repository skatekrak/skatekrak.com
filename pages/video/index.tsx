import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Sidebar from 'components/pages/videos/Sidebar';
import VideoFeed from 'components/pages/videos/VideoFeed';

const VideoHead = () => (
    <Head>
        <title>Krak | Videos</title>
        <meta name="description" content="Don't miss anything in the skateboarding world" />
        <meta property="og:title" content="Krak | Videos" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/videos" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-news.jpg" />
        <meta property="og:description" content="Don't miss anything in the skateboarding world" />
    </Head>
);

type State = {
    sidebarNavIsOpen: boolean;
};

class Videos extends React.PureComponent<{}, State> {
    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const { sidebarNavIsOpen } = this.state;
        return (
            <Layout head={<VideoHead />}>
                <React.Fragment>
                    <BannerTop />
                    <div id="videos-container" className="inner-page-container">
                        <LayoutFeed
                            mainView={<VideoFeed sidebarNavIsOpen={sidebarNavIsOpen} />}
                            sidebar={
                                <Sidebar
                                    handleOpenSidebarNav={this.handleOpenSidebarNav}
                                    sidebarNavIsOpen={sidebarNavIsOpen}
                                />
                            }
                        />
                    </div>
                </React.Fragment>
            </Layout>
        );
    }

    private handleOpenSidebarNav = () => {
        const { sidebarNavIsOpen } = this.state;
        this.setState({ sidebarNavIsOpen: !sidebarNavIsOpen });
    };
}

export default Videos;
