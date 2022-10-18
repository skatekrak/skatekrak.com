import React from 'react';
import Head from 'next/head';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import * as S from 'components/pages/callToAdventure/CallToAdventure.styled';
import * as SContent from 'components/pages/callToAdventure/CallToAdventureContent/CallToAdventureContent.styled';

export const PATH_ROADMAP = '/roadmap';

const RoadmapHead = () => {
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
            <meta property="og:url" content={`${baseURL}${PATH_ROADMAP}`} />
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

const Roadmap = () => {
    return (
        <Layout head={<RoadmapHead />}>
            <S.CallToAdventurePageContainer>
                <S.CallToAdventureContentContainer>
                    <S.CallToAdventureH1 as="h1">Roadmap</S.CallToAdventureH1>
                    <SContent.CallToAdventureBody>
                        We’re currently re-writing the whole back-end. Hence you might experience few glitch here &
                        there. Or the experience on the map itself might not be perfect. In this case, please, feel free
                        to reach out. Either on discord directly, on twitter or by email.
                        <br />
                        <br />
                        Oh, we’re building it the open-source way 👉{' '}
                        <a href="https://github.com/skatekrak/backends" target="_blank" rel="noreferrer">
                            <Typography as="span" component="body1">
                                https://github.com/skatekrak/backends
                            </Typography>
                        </a>
                    </SContent.CallToAdventureBody>
                </S.CallToAdventureContentContainer>
            </S.CallToAdventurePageContainer>
        </Layout>
    );
};

export default Roadmap;
