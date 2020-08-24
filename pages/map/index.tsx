import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import MapContainer from 'components/pages/map/MapContainer';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';

const MapHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
    return (
        <Head>
            <title>Krak | Map</title>
            <meta name="description" content="Krak Map. Discover new spots to skate in from a unique angle." />
            <meta property="og:title" content="Krak Map" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/map`} />
            <meta property="og:image" content={`${baseURL}/images/og-map.png`} />
            <meta property="og:description" content="Krak Map. Discover new spots to skate in from a unique angle." />
        </Head>
    );
};

const Map: NextPage = () => (
    <TrackedPage name="Map">
        <Layout head={<MapHead />}>
            <MapContainer />
        </Layout>
    </TrackedPage>
);

export default Map;
