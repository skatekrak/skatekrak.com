import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Feed from 'components/pages/mag/Feed';
import Sidebar from 'components/pages/mag/Sidebar';

const MagHead = () => (
    <Head>
        <title>Krak Mag. | skateboarding</title>
        <meta name="description" content="Krak mag" />
        <meta property="og:title" content="Krak mag" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/mag" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-news.jpg" />
        <meta property="og:description" content="Krak mag" />
        {/* TODO: Connect WP OG tags */}
    </Head>
);

type State = {
    sidebarNavIsOpen: boolean;
};

class Mag extends React.Component<{}, State> {
    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const { sidebarNavIsOpen } = this.state;

        return (
            <Layout head={<MagHead />}>
                <BannerTop />
                <div id="mag-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Feed sidebarNavIsOpen={sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar
                                handleOpenSidebarNav={this.handleOpenSidebarNav}
                                sidebarNavIsOpen={sidebarNavIsOpen}
                            />
                        }
                    />
                </div>
            </Layout>
        );
    }

    private handleOpenSidebarNav = () => {
        const { sidebarNavIsOpen } = this.state;
        this.setState({ sidebarNavIsOpen: !sidebarNavIsOpen });
    };
}

export default Mag;
