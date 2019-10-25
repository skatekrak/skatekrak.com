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
            <meta
                name="description"
                content="Krak opens its own skateshop - exclusively for its club members - become a Kraken"
            />
            <meta property="og:title" content="Krak Shop | Exclusive stuff & awesome deals" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/shop`} />
            <meta property="og:image" content={`${baseURL}/images/shop-pattern.jpg`} />
            <meta
                property="og:description"
                content="Krak opens its own skateshop - exclusively for its club members - become a Kraken"
            />
        </Head>
    );
};

const Shop: NextPage = () => (
    <TrackedPage name="Shop">
        <Layout head={<ShopHead />}>
            <div id="shop-container" className="inner-page-container container-fluid">
                <div id="shop-header">
                    <h1 id="shop-header-title">Shop</h1>
                    <h2 id="shop-header-subtitle">[Exclusive stuff & awesome ****]</h2>
                    <div id="shop-header-hero-img-container">
                        <span id="shop-header-hero-img" role="img" aria-label="Krak shop" />
                    </div>
                </div>
                <div id="shop-main">
                    <h3 id="shop-main-title">
                        Aladdin's cave on the other side
                        <br />- get your password first.
                    </h3>
                    <a className="button-primary club-cta" href="#" target="_blank" rel="noreferrer noopener">
                        Access shop
                    </a>
                    <div id="shop-main-countries">
                        Only open for those countries:
                        <div id="shop-main-countries-flag">
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/united-states.svg"
                                alt="Flag"
                            />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/france.svg" alt="Flag" />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/germany.svg" alt="Flag" />
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/united-kingdom.svg"
                                alt="Flag"
                            />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/portugal.svg" alt="Flag" />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/belgium.svg" alt="Flag" />
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/netherlands.svg"
                                alt="Flag"
                            />
                        </div>
                    </div>
                    <div id="shop-main-bg-img-container">
                        <span id="shop-main-bg-img" role="img" aria-label="Krak products" />
                    </div>
                </div>
            </div>
        </Layout>
    </TrackedPage>
);

export default Shop;
