import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import dynamic from 'next/dynamic';

import Layout from 'components/Layout';
import TrackedPage from 'components/pages/TrackedPage';

const DyamicMapContainer = dynamic(() => import('components/pages/map/MapContainer'), { ssr: false });

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
            <meta property="og:description" content="Discover new spots to skate and explore out there." />
        </Head>
    );
};

const Map: NextPage = () => (
    <TrackedPage name="Map">
        <Layout head={<MapHead />}>
            <DyamicMapContainer />
        </Layout>
    </TrackedPage>
);

export default Map;
