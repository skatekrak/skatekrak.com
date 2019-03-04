import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
// import BannerTop from 'components/Ui/Banners/BannerTop';

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
                <React.Fragment>
                    {/* <BannerTop /> */}
                    <div id="videos-container" className="inner-page-container container-fluid">
                        <div className="row">
                            <VideoFeed />
                        </div>
                    </div>
                </React.Fragment>
            </Layout>
        );
    }
}

export default Videos;
