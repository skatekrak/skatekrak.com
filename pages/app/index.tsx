import { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';

const AppHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak App | skateboarding</title>
            <meta name="description" content="Krak app" />
            <meta property="og:title" content="Krak app" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/app`} />
            <meta property="og:image" content={`${baseURL}/images/og-home.jpg`} />
            <meta property="og:description" content="Krak app" />
            {/* TODO: Connect WP OG tags */}
        </Head>
    );
};

const App: NextPage = () => (
    <Layout head={<AppHead />}>
        <div id="app-container" className="inner-page-container">
            <div id="app-illustration-container">L'illustration de la pocket</div>
            <h1 id="app-title">Skateboarding culture in your pocket</h1>
            <div id="app-links">
                <a href="#" className="app-link">
                    App store
                </a>
                <a href="#" className="app-link">
                    Android store
                </a>
            </div>
        </div>
    </Layout>
);

export default App;
