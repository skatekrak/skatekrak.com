import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';
import RefreshScrollOnNewPage from 'components/Ui/Utils/RefreshScrollOnNewPage';

import Feed from 'components/pages/mag/Feed';
import Sidebar from 'components/pages/mag/Sidebar';

const MagHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
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

const Mag: NextPage = () => {
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    const setSidebarOpeness = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    return (
        <RefreshScrollOnNewPage>
            <Layout head={<MagHead />}>
                <BannerTop offsetScroll link="/" text="Become a co-owner" />
                <div id="mag-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Feed sidebarNavIsOpen={sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar handleOpenSidebarNav={setSidebarOpeness} sidebarNavIsOpen={sidebarNavIsOpen} />
                        }
                    />
                </div>
            </Layout>
        </RefreshScrollOnNewPage>
    );
};

export default Mag;
