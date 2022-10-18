import React, { useRef } from 'react';
import Head from 'next/head';

import Layout from 'components/Layout';
import CallToAdventureSideNav from 'components/pages/callToAdventure/CallToAdventureSideNav';
import CallToAdventureContent from 'components/pages/callToAdventure/CallToAdventureContent';
import CallToAdventureCTA from 'components/pages/callToAdventure/CallToAdventureCTA/CallToAdventureCTA';
import * as S from 'components/pages/callToAdventure/CallToAdventure.styled';

export const PATH_CALL_TO_ADVENTURE = '/call-to-adventure';

const CallToAdventureHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <Head>
            <title>Krak | The first skateboarding DAO x co-op</title>
            <meta
                name="description"
                content="Our mission is to make more skateboarding happen in this world. We build knowledge, ressources and tools for skateboarders, to inspire creative collaboration, cooperation and mutual support within the community."
            />
            <meta property="og:title" content="Krak | The first skateboarding DAO x co-op" />
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
    const bodyContentRef = useRef();
    return (
        <Layout head={<CallToAdventureHead />}>
            <S.CallToAdventurePageContainer>
                <S.CallToAdventureGrid>
                    <S.CallToAdventureHeader>
                        <S.CallToAdventureH1 as="h1">
                            Building a common good
                            <br />
                            for skateboaders
                        </S.CallToAdventureH1>
                    </S.CallToAdventureHeader>
                </S.CallToAdventureGrid>
                <S.CallToAdventureGrid>
                    <CallToAdventureSideNav bodyContentRef={bodyContentRef} />
                    <S.CallToAdventureContentContainer ref={bodyContentRef}>
                        <CallToAdventureContent />
                    </S.CallToAdventureContentContainer>
                    <CallToAdventureCTA />
                </S.CallToAdventureGrid>
            </S.CallToAdventurePageContainer>
        </Layout>
    );
};

export default CallToAdventure;
