import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import dynamic from 'next/dynamic';

import Layout from 'components/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSpotOverview } from 'lib/carrelageClient';
import { CloudinaryFile, SpotOverview } from 'shared/feudartifice/types';
import Feudartifice from 'shared/feudartifice';
import axios from 'axios';

const DyamicMapContainer = dynamic(() => import('components/pages/map/MapContainer'), { ssr: false });

type OGData = {
    title: string;
    imageUrl?: string;
    description: string;
    url: string;
};

const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
type MapHeadProps = {
    ogData?: OGData;
};
const MapHead = ({ ogData }: MapHeadProps) => {
    return (
        <Head>
            <title>Krak | skateboarding community and culture</title>
            <meta
                name="description"
                content="The world's biggest collection of skate spots and skateboarding knowledge online."
            />
            <meta
                property="og:title"
                content={ogData.title != null ? `${ogData.title} | Krak` : 'Krak | skateboarding community and culture'}
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ogData.url ?? baseURL} />
            <meta property="twitter:card" content="summarr_large_card" />
            <meta property="twitter:site" content="@skatekrak" />
            {ogData.imageUrl != null ? (
                <>
                    <meta property="og:image" content={ogData.imageUrl} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:type" content="image/jpeg" />
                </>
            ) : (
                <meta property="og:image" content={`${baseURL}/images/og-map.png`} />
            )}
            <meta
                property="og:description"
                content={ogData.description ?? 'Make more skateboarding happen in the world.'}
            />
        </Head>
    );
};

type MapPageProps = {
    ogData?: OGData;
};

const Index: NextPage<MapPageProps> = ({ ogData }) => (
    <TrackedPage name="Map">
        <Layout head={<MapHead ogData={ogData} />}>
            <DyamicMapContainer />
        </Layout>
    </TrackedPage>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const queryClient = new QueryClient();

    let ogData: OGData | undefined = undefined;

    if (query.spot != null && typeof query.spot === 'string') {
        // const response = await axios.get<SpotOverview>(`${process.env.CARRELAGE_URL}spots/${query.spot}/overview`);
        // const overview = response.data;
        try {
            const overview = await getSpotOverview(query.spot);

            ogData = {
                title: overview.spot.name,
                description: `${overview.spot.location.streetNumber} ${overview.spot.location.streetName}, ${overview.spot.location.city} ${overview.spot.location.country}`,
                imageUrl: `https://res.cloudinary.com/krak/image/upload/c_fill,w_1200,h_630/${overview.mostLikedMedia.image.publicId}.jpg`,
                url: `${baseURL}?spot=${query.spot}`,
            };
            await queryClient.prefetchQuery<SpotOverview>(['load-overview', query.spot], () => overview);
        } catch (err) {
            console.error(err);
        }
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            ogData: ogData,
        },
    };
};

export default Index;
