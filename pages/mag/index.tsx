import { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Article from 'components/pages/mag/Article';
import Feed, { Post } from 'components/pages/mag/Feed';
import Sidebar from 'components/pages/mag/Sidebar';

const MagHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak Mag | our very own skate stories, interviews, reviews and cie.</title>
            <meta
                name="description"
                content="We are so lucky to be passionate about skateboarding and have the chance to meet so many inspiring people in the skarteboarding world - here are their stories"
            />
            <meta property="og:title" content="Krak Mag | our very own skate stories, interviews, reviews and cie." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/mag`} />
            <meta property="og:image" content={`${baseURL}/images/og-mag.jpg`} />
            <meta
                property="og:description"
                content="We are so lucky to be passionate about skateboarding and have the chance to meet so many inspiring people in the skarteboarding world - here are their stories"
            />
        </Head>
    );
};

type Props = {
    items: Post[];
};

const Mag: NextPage<Props> = ({ items }) => {
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    const setSidebarOpeness = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    //
    const router = useRouter();
    let selectedArticle: Post;
    if (router.query.slug) {
        // Search for current slug in items list
        selectedArticle = (() => {
            for (const item of items) {
                if (item.slug === router.query.slug) {
                    return item;
                }
            }
            return undefined;
        })();
    }

    const mainView = () => {
        if (selectedArticle) {
            return <Article post={selectedArticle} sidebarNavIsOpen={sidebarNavIsOpen} />;
        }
        return <Feed sidebarNavIsOpen={sidebarNavIsOpen} />;
    };

    return (
        <Layout head={<MagHead />}>
            <BannerTop />
            <div id={selectedArticle ? 'mag-article-container' : 'mag-container'} className="inner-page-container">
                <LayoutFeed
                    mainView={mainView()}
                    sidebar={
                        <Sidebar
                            post={selectedArticle}
                            handleOpenSidebarNav={setSidebarOpeness}
                            sidebarNavIsOpen={sidebarNavIsOpen}
                        />
                    }
                />
            </div>
        </Layout>
    );
};

export default connect(({ mag }: Types.RootState) => ({
    items: mag.items,
}))(Mag);
