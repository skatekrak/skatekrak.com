import { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Articles from 'components/pages/news/Articles';
import ArticleModal from 'components/pages/news/Articles/Article/ArticleModal';
import Sidebar from 'components/pages/news/Sidebar';

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

const News: NextPage = () => {
    const router = useRouter();
    const [sidebarNavIsOpen, setSidebarIsOpen] = useState(false);

    const id = router.query.id as string;

    const handleOpenSidebarNav = () => {
        setSidebarIsOpen(!sidebarNavIsOpen);
    };

    return (
        <Layout head={<NewsHead />}>
            <BannerTop />
            <div id="news-container" className="inner-page-container">
                {id && <ArticleModal id={id} />}
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

export default News;
