import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import Layout from '@/components/Layout';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getSpotOverview } from '@krak/carrelage-client';
import { SpotOverview } from '@/shared/feudartifice/types';
import { draw } from 'radash';
import cities from '@/data/cities/_cities';
import { centerFromBounds } from '@/lib/map/helpers';
import { useViewport } from '@/lib/hook/queryState';

const DyamicMapContainer = dynamic(() => import('@/components/pages/map/MapContainer'), { ssr: false });

type OGData = {
    title: string;
    imageUrl: string | null;
    description: string;
    url: string;
};

const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
type MapHeadProps = {
    ogData: OGData | null;
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
                content={
                    ogData?.title != null ? `${ogData.title} | Krak` : 'Krak | skateboarding community and culture'
                }
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={ogData?.url ?? baseURL} />
            <meta property="twitter:card" content="summarr_large_card" />
            <meta property="twitter:site" content="@skatekrak" />
            {ogData?.imageUrl != null ? (
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
                content={ogData?.description ?? 'Make more skateboarding happen in the world.'}
            />
        </Head>
    );
};

type MapPageProps = {
    ogData: OGData | null;
    defaultViewport: { latitude: number; longitude: number } | null;
};

const Index: NextPage<MapPageProps> = ({ ogData, defaultViewport }) => {
    const [, setViewport] = useViewport();

    useEffect(() => {
        if (defaultViewport != null) {
            (async () => {
                await setViewport({
                    ...defaultViewport,
                });
            })();
        }
    }, [setViewport, defaultViewport]);

    return (
        <Layout head={<MapHead ogData={ogData} />}>
            <DyamicMapContainer />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const queryClient = new QueryClient();

    let ogData: OGData | null = null;
    let viewport: MapPageProps['defaultViewport'] = null;

    if (query.spot != null && typeof query.spot === 'string') {
        try {
            const overview = await getSpotOverview(query.spot);

            ogData = {
                title: overview.spot.name,
                description: `${overview.spot.location.streetNumber} ${overview.spot.location.streetName}, ${overview.spot.location.city} ${overview.spot.location.country}`,
                imageUrl:
                    overview.mostLikedMedia != null
                        ? `https://res.cloudinary.com/krak/image/upload/c_fill,w_1200,h_630/${overview.mostLikedMedia.image.publicId}.jpg`
                        : null,
                url: `${baseURL}?spot=${query.spot}`,
            };
            await queryClient.prefetchQuery<SpotOverview>({
                queryKey: ['load-overview', query.spot],
                queryFn: () => overview,
            });
        } catch (err) {
            console.error(err);
        }
    } else if (query.latitude == null || query.longitude == null) {
        // choose random city to land to
        const randomCity = draw(cities);
        if (randomCity != null) {
            console.log('randomCity', randomCity);
            viewport = centerFromBounds(randomCity.bounds);
        }
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            ogData: ogData,
            defaultViewport: viewport,
        },
    };
};

export default Index;
