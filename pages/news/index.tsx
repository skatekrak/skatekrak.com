import getConfig from 'next/config';
import Head from 'next/head';
import { Router, withRouter } from 'next/router';
import React from 'react';

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

type Props = {
    router: Router;
};

type State = {
    sidebarNavIsOpen: boolean;
};

class News extends React.PureComponent<Props, State> {
    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const { router } = this.props;
        const { sidebarNavIsOpen } = this.state;

        const id = router.query.id as string;

        return (
            <Layout head={<NewsHead />}>
                <React.Fragment>
                    <BannerTop />
                    <div id="news-container" className="inner-page-container">
                        {id && <ArticleModal id={id} />}
                        <LayoutFeed
                            mainView={<Articles sidebarNavIsOpen={sidebarNavIsOpen} />}
                            sidebar={
                                <Sidebar
                                    handleOpenSidebarNav={this.handleOpenSidebarNav}
                                    sidebarNavIsOpen={sidebarNavIsOpen}
                                />
                            }
                        />
                    </div>
                </React.Fragment>
            </Layout>
        );
    }

    private handleOpenSidebarNav = () => {
        const { sidebarNavIsOpen } = this.state;
        this.setState({ sidebarNavIsOpen: !sidebarNavIsOpen });
    };
}

export default withRouter(News);
