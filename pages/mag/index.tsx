import getConfig from 'next/config';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Feed from 'components/pages/mag/Feed';
import Sidebar from 'components/pages/mag/Sidebar';
import { NextPage } from 'next';

const MagHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak Mag. | skateboarding</title>
            <meta name="description" content="Krak mag" />
            <meta property="og:title" content="Krak mag" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/mag`} />
            <meta property="og:image" content={`${baseURL}/images/og-news.jpg`} />
            <meta property="og:description" content="Krak mag" />
            {/* TODO: Connect WP OG tags */}
        </Head>
    );
};

type State = {
    sidebarNavIsOpen: boolean;
};

class Mag extends React.Component<{}, State> {
    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const setSidebarOpeness = () => {
            this.setState({ sidebarNavIsOpen: !this.state.sidebarNavIsOpen });
        };

        return (
            <Layout head={<MagHead />}>
                <BannerTop />
                <div id="mag-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Feed sidebarNavIsOpen={this.state.sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar
                                handleOpenSidebarNav={setSidebarOpeness}
                                sidebarNavIsOpen={this.state.sidebarNavIsOpen}
                            />
                        }
                    />
                </div>
            </Layout>
        );
    }
}

export default Mag;
