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

const NewsHead = ({ content }: { content: Content }) => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;

    const description = content
        ? content.summary
        : "Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from 40 sources hand-curated with passion, love & noise.";

    const title = content ? content.title : 'Krak | News';
    const image = (() => {
        if (content) {
            if (content.media && content.media.url) {
                return `${getConfig().publicRuntimeConfig.CACHING_URL}/${encodeURIComponent(content.media.url)}`;
            }
            return content.source.coverUrl;
        }
        return `${baseURL}/images/og-news.jpg`;
    })();

    const url = (() => {
        if (content) {
            return `${baseURL}/news?id=${content.id}`;
        }
        return `${baseURL}/news`;
    })();

    return (
        <Head>
            <title>Krak News | {title}</title>
            <meta name="description" key="description" content={description} />
            <meta property="og:title" content={`Krak News | ${title}`} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:description" key="og:description" content={description} />
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
        <Layout head={<NewsHead content={content} />}>
            <BannerTop />
            <div id="news-container" className="inner-page-container">
                <ArticleModal show={gotId} content={content} />
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
