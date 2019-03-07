import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Articles from 'components/pages/news/Articles';
import Menu from 'components/pages/news/Menu';

type State = {
    sourcesMenuIsOpen: boolean;
};

const NewsHead = () => (
    <Head>
        <title>Krak | News</title>
        <meta
            name="description"
            content="Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from 40 sources hand-curated with passion, love & noise."
        />
        <meta property="og:title" content="Krak | News" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/news" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-news.jpg" />
        <meta
            property="og:description"
            content="Don't miss anything in the skateboarding world - Krak is bringing you the 'news' from 40 sources hand-curated with passion, love & noise"
        />
    </Head>
);

class News extends React.PureComponent<{}, State> {
    public state: State = {
        sourcesMenuIsOpen: false,
    };

    public render() {
        const { sourcesMenuIsOpen } = this.state;
        return (
            <Layout head={<NewsHead />}>
                <React.Fragment>
                    <BannerTop />
                    <div id="news-container" className="inner-page-container">
                        <LayoutFeed
                            mainView={<Articles sourcesMenuIsOpen={sourcesMenuIsOpen} />}
                            sideBar={
                                <Menu
                                    sourcesMenuIsOpen={sourcesMenuIsOpen}
                                    handleOpenSourcesMenu={this.handleOpenSourcesMenu}
                                />
                            }
                        />
                    </div>
                </React.Fragment>
            </Layout>
        );
    }

    private handleOpenSourcesMenu = () => {
        const { sourcesMenuIsOpen } = this.state;
        this.setState({ sourcesMenuIsOpen: !sourcesMenuIsOpen });
    };
}

export default News;
