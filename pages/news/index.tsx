import axios from 'axios';
import { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Articles from 'components/pages/news/Articles';
import ArticleModal from 'components/pages/news/Articles/Article/ArticleModal';
import Sidebar from 'components/pages/news/Sidebar';

import { Content } from 'rss-feed';

const NewsHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak | News</title>
            <meta
                name="description"
                content="Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from 40 sources hand-curated with passion, love & noise."
            />
            <meta property="og:title" content="Krak | News" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/news`} />
            <meta property="og:image" content={`${baseURL}/images/og-news.jpg`} />
            <meta
                property="og:description"
                content="Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from 40 sources hand-curated with passion, love & noise"
            />
        </Head>
    );
};

type Props = {
    content?: Content | undefined;
    gotId: boolean;
};

const News: NextPage<Props> = ({ content, gotId }) => {
    const [sidebarNavIsOpen, setSidebarIsOpen] = useState(false);

    const handleOpenSidebarNav = () => {
        setSidebarIsOpen(!sidebarNavIsOpen);
    };

    return (
        <Layout head={<NewsHead />}>
            <BannerTop />
            <div id="news-container" className="inner-page-container">
                {gotId && <ArticleModal content={content} />}
                <LayoutFeed
                    mainView={<Articles sidebarNavIsOpen={sidebarNavIsOpen} />}
                    sidebar={
                        <Sidebar handleOpenSidebarNav={handleOpenSidebarNav} sidebarNavIsOpen={sidebarNavIsOpen} />
                    }
                />
            </div>
        </Layout>
    );
};

News.getInitialProps = async ({ query }) => {
    if (query.id) {
        try {
            const res = await axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/contents/${query.id}`);
            return { content: res.data, gotId: true };
        } catch (error) {
            return { gotId: true };
        }
    }

    return { gotId: false };
};

export default News;
