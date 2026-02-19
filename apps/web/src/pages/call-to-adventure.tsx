import React, { ElementRef, useRef } from 'react';
import Head from 'next/head';

import Layout from '@/components/Layout';
import CallToAdventureSideNav from '@/components/pages/callToAdventure/CallToAdventureSideNav';
import CallToAdventureContent from '@/components/pages/callToAdventure/CallToAdventureContent';
import CallToAdventureCTA from '@/components/pages/callToAdventure/CallToAdventureCTA/CallToAdventureCTA';
import Typography from '@/components/Ui/typography/Typography';

export const PATH_CALL_TO_ADVENTURE = '/call-to-adventure';

const CallToAdventureHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <Head>
            <title>krak | a common good for skateboarders</title>
            <meta
                name="description"
                content="Our mission is to make more skateboarding happen in this world. We build knowledge, ressources and tools for skateboarders, to inspire creative collaboration, cooperation and mutual support within the community."
            />
            <meta property="og:title" content="krak | a common good for skateboarders" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}${PATH_CALL_TO_ADVENTURE}`} />
            <meta property="og:image" content={`${baseURL}/images/og-home.jpg`} />
            <meta
                property="og:description"
                content="Our mission is to make more skateboarding happen in this world. We build knowledge, ressources and tools for skateboarders, to inspire creative collaboration, cooperation and mutual support within the community."
            />
            <meta property="twitter:card" content="summarr_large_card" />
            <meta property="twitter:site" content="@skatekrak" />
        </Head>
    );
};

const CallToAdventure = () => {
    const bodyContentRef = useRef<ElementRef<'div'> | null>(null);
    return (
        <Layout head={<CallToAdventureHead />}>
            <div className="grow w-full py-24 text-onDark-highEmphasis bg-tertiary-dark">
                <div className="w-full max-w-[96rem] mx-auto px-6 tablet:px-32 laptop-s:grid laptop-s:grid-cols-[1fr_3fr_1fr] laptop-s:gap-16 laptop-s:px-12">
                    <div className="laptop-s:col-start-2">
                        <Typography className="mb-12 font-roboto-condensed-bold text-[2.5rem] uppercase [&_span]:lowercase" as="h1">
                            Building a common good
                            <br />
                            for skateboarders
                        </Typography>
                        <p className="mb-8 pb-4 italic text-onDark-mediumEmphasis border-b border-solid border-onDark-placeholder">
                            first written & published on nov. 1st, 2022
                        </p>
                    </div>
                </div>
                <div className="w-full max-w-[96rem] mx-auto px-6 tablet:px-32 laptop-s:grid laptop-s:grid-cols-[1fr_3fr_1fr] laptop-s:gap-16 laptop-s:px-12">
                    <CallToAdventureSideNav bodyContentRef={bodyContentRef} />
                    <div className="flex flex-col laptop-s:col-start-2 w-full max-w-[48rem] mx-auto whitespace-pre-line" ref={bodyContentRef}>
                        <CallToAdventureContent />
                    </div>
                    <CallToAdventureCTA />
                </div>
            </div>
        </Layout>
    );
};

export default CallToAdventure;
