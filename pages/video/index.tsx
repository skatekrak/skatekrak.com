import getConfig from 'next/config';
import Head from 'next/head';
import { Router, withRouter } from 'next/router';
import React from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Sidebar from 'components/pages/videos/Sidebar';
import VideoFeed from 'components/pages/videos/VideoFeed';
import VideoModal from 'components/pages/videos/VideoFeed/Video/VideoModal';

const VideoHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak | Videos</title>
            <meta name="description" content="Don't miss anything in the skateboarding world" />
            <meta property="og:title" content="Krak | Videos" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/videos`} />
            <meta property="og:image" content={`${baseURL}/images/og-news.jpg`} />
            <meta property="og:description" content="Don't miss anything in the skateboarding world" />
        </Head>
    );
};

type Props = {
    router: Router;
};

type State = {
    sidebarNavIsOpen: boolean;
};

class Videos extends React.Component<Props, State> {
    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const { router } = this.props;
        const { sidebarNavIsOpen } = this.state;

        const id = router.query.id as string;

        return (
            <Layout head={<VideoHead />}>
                <React.Fragment>
                    <BannerTop />
                    <div id="videos-container" className="inner-page-container">
                        {id && <VideoModal id={id} />}
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

export default withRouter(Videos);
