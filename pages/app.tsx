import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import IconAppStore from 'components/Ui/Icons/Stores/Appstore';
import IconPlayStore from 'components/Ui/Icons/Stores/Playstore';

const AppHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
    return (
        <Head>
            <title>Krak App | skateboarding</title>
            <meta
                name="description"
                content="Krak is a new way for skateboarders to share photos, videos, and spots with their friends and community. Stack clips, build your catalog, get noticed for your skills, discover new spots, and the best way to get there. By skateboarders for skateboarders."
            />
            <meta property="og:title" content="Krak app" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/app`} />
            <meta property="og:image" content={`${baseURL}/images/og-home.jpg`} />
            <meta
                property="og:description"
                content="Krak is a new way for skateboarders to share photos, videos, and spots with their friends and community. Stack clips, build your catalog, get noticed for your skills, discover new spots, and the best way to get there. By skateboarders for skateboarders."
            />
        </Head>
    );
};

const App: NextPage = () => (
    <TrackedPage name="App">
        <Layout head={<AppHead />}>
            <div id="app-container" className="inner-page-container container-fluid">
                <div id="app-content-container">
                    <img
                        src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/images/krak-app-illustration.svg`}
                        alt=""
                        id="app-illustration"
                    />
                    <h1 id="app-title">
                        Skateboarding culture
                        <br />
                        in your pocket
                    </h1>
                    <div id="app-links">
                        <a
                            className="app-link"
                            href="https://itunes.apple.com/us/app/krak/id916474561"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <IconAppStore />
                        </a>
                        <a
                            className="app-link"
                            href="https://play.google.com/store/apps/details?id=com.krak"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <IconPlayStore />
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    </TrackedPage>
);

export default App;
