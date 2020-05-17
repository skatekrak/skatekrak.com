import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Sidebar from 'components/pages/videos/Sidebar';
import VideoFeed from 'components/pages/videos/VideoFeed';
import { Video } from 'rss-feed';

const DynamicVideoModal = dynamic(() => import('components/pages/videos/VideoFeed/Video/VideoModal'));

const VideoHead = ({ video }: { video: Video }) => {
    const baseURL = process.env.NEXT_PUBLIC_NEXT_PUBLIC_WEBSITE_URL;

    const title = (() => {
        if (video) {
            return `Krak Videos | ${video.title}`;
        }
        return 'Krak | Videos';
    })();
    const description = video ? video.description : "Don't miss anything in the skateboarding world";
    const image = video ? video.thumbnail : `${baseURL}/images/og-news.jpg`;
    let url = `${baseURL}/video`;
    if (video) {
        url += `?id=${video.id}`;
    }

    const type = video ? 'video.other' : 'website';

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" key="description" content={description} />
            <meta property="og:title" key="og:title" content={title} />
            <meta property="og:type" key="og:type" content={type} />
            <meta property="og:url" key="og:url" content={url} />
            <meta property="og:image" key="og:image" content={image} />
            <meta property="og:description" key="og:description" content={description} />
        </Head>
    );
};

type Props = {
    video?: Video;
    gotId: boolean;
};

const Videos: NextPage<Props> = ({ video, gotId }) => {
    const [sidebarNavIsOpen, setSidebarNavIsOpen] = useState(false);

    const handleOpenSidebarNav = () => {
        setSidebarNavIsOpen(!sidebarNavIsOpen);
    };

    return (
        <Layout head={<VideoHead video={video} />}>
            <BannerTop offsetScroll link="/" text="Become a co-owner" />
            <div id="videos-container" className="inner-page-container">
                {gotId && <DynamicVideoModal video={video} />}
                <LayoutFeed
                    mainView={<VideoFeed sidebarNavIsOpen={sidebarNavIsOpen} />}
                    sidebar={
                        <Sidebar handleOpenSidebarNav={handleOpenSidebarNav} sidebarNavIsOpen={sidebarNavIsOpen} />
                    }
                />
            </div>
        </Layout>
    );
};

Videos.getInitialProps = async ({ query }: NextPageContext) => {
    if (query.id) {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/videos/${query.id}`);
            return { video: res.data, gotId: true };
        } catch {
            return { gotId: true };
        }
    }
    return { gotId: false };
};

export default Videos;
