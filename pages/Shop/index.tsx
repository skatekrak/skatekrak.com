import { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';

const ShopHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak Shop | Exclusive stuff & awesome deals</title>
            <meta name="description" content="We always come back from trips with something in our luggages." />
            <meta property="og:title" content="Krak Shop | Exclusive stuff & awesome deals" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/shop`} />
            <meta property="og:image" content={`${baseURL}/images/og-home.jpg`} />
            <meta property="og:description" content="We always come back from trips with something in our luggages." />
        </Head>
    );
};

const Shop: NextPage = () => (
    <TrackedPage name="Shop">
        <Layout head={<ShopHead />}>
            <div id="shop-container" className="inner-page-container container-fluid">
                <h1 id="shop-title">Shop</h1>
            </div>
        </Layout>
    </TrackedPage>
);

export default Shop;
