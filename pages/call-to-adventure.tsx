import React from 'react';
import Head from 'next/head';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
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
    return (
        <Layout head={<CallToAdventureHead />}>
            <S.CallToAdventurePageContainer>
                <S.CallToAdventureContent>
                    <S.CallToAdventureH1 as="h1">
                        The first
                        <br />
                        skateboarding
                        <br />
                        DAO <span>x</span> Co-op
                    </S.CallToAdventureH1>
                    <S.CallToAdventureIntro component="heading5">
                        Let's make sure skateboarding keeps its roots deep in creativity, openness, rebellion & freedom.
                    </S.CallToAdventureIntro>
                    <S.CallToAdventureBody>
                        Our mission is to make more skateboarding happen in this world. We build knowledge, ressources
                        and tools for skateboarders, to inspire creative collaboration, cooperation and mutual support
                        within the community.
                        <br />
                        <br />
                        Think an open, decentralized, collective Wikipedia focused on skateboarding.
                        <br />
                        <br />
                        And 100% owned by skateboarders.
                    </S.CallToAdventureBody>
                    <S.CallToAdventureIsTyping>
                        <S.CallToAdventureIsTypingKrak component="subtitle1">Krak</S.CallToAdventureIsTypingKrak>
                        <Typography as="span">is typing</Typography>
                        <S.CallToAdventureIsTypingAnimation delay={-0.2}>.</S.CallToAdventureIsTypingAnimation>
                        <S.CallToAdventureIsTypingAnimation delay={-0.1}>.</S.CallToAdventureIsTypingAnimation>
                        <S.CallToAdventureIsTypingAnimation>.</S.CallToAdventureIsTypingAnimation>
                    </S.CallToAdventureIsTyping>
                </S.CallToAdventureContent>
            </S.CallToAdventurePageContainer>
        </Layout>
    );
};

export default CallToAdventure;
