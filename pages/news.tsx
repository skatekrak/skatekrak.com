import axios from 'axios';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Articles from 'components/pages/news/Articles';
import Sidebar from 'components/pages/news/Sidebar';

import Content from 'models/Content';

const DynamicArticleModal = dynamic(() => import('components/pages/news/Articles/Article/ArticleModal'), {
    ssr: false,
});

const NewsHead = ({ content }: { content: Content }) => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    const description = (() => {
        if (content) {
            return content.getContent() || '';
        }
        return "Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from sources hand-curated with passion, love & noise.";
    })();

    const title = (() => {
        if (content) {
            return `Krak News | ${content.title}`;
        }
        return 'Krak | News';
    })();

    const image = (() => {
        if (content) {
            return content.getImage();
        }
        return `${baseURL}/images/og-news.jpg`;
    })();

    const url = (() => {
        if (content) {
            return content.getArticlePopupUrl();
        }
        return `${baseURL}/news`;
    })();

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" key="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:description" key="og:description" content={description} />
        </Head>
    );
};

type Props = {
    contentData?: any;
    gotId: boolean;
};

const News: NextPage<Props> = ({ contentData, gotId }) => {
    const [sidebarNavIsOpen, setSidebarIsOpen] = useState(false);

    const handleOpenSidebarNav = () => {
        setSidebarIsOpen(!sidebarNavIsOpen);
    };

    const content = contentData ? new Content(contentData) : undefined;

    return (
        <Layout head={<NewsHead content={content} />}>
            <BannerTop link="/" offsetScroll text="Become a co-owner" />
            <div id="news-container" className="inner-page-container">
                <DynamicArticleModal show={gotId} content={content} />
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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents/${query.id}`);
            return { contentData: res.data, gotId: true };
        } catch (error) {
            return { gotId: true };
        }
    }

    return { gotId: false };
};

export default News;
