import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Menu from 'components/pages/videos/Menu';
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

class Videos extends React.PureComponent<{}, {}> {
    public render() {
        return (
            <Layout head={<VideoHead />}>
                <TrackedPage name={`Video`} />
                <React.Fragment>
                    <BannerTop />
                    <div id="videos-container" className="inner-page-container">
                        <LayoutFeed mainView={<VideoFeed />} sideBar={<Menu />} />
                    </div>
                </React.Fragment>
            </Layout>
        );
    }
}

export default Videos;
