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
            <title>Krak | skateboarding community and culture</title>
            <meta
                name="description"
                content="The world's biggest collection of skate spots and skateboarding knowledge online."
            />
            <meta property="og:title" content="Krak | skateboarding community and culture" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}`} />
            <meta property="og:image" content={`${baseURL}/images/og-map.png`} />
            <meta property="og:description" content="Make more skateboarding happen in the world." />
        </Head>
    );
};

const Index: NextPage = () => (
    <TrackedPage name="Map">
        <Layout head={<MapHead />}>
            <DyamicMapContainer />
        </Layout>
    </TrackedPage>
);

export default Index;
