import Head from 'next/head';
import React from 'react';

import Layout from 'components/Layout/Layout';
import ClubPresentation from 'components/pages/club/presentation';
import TrackedPage from 'components/pages/TrackedPage';

const ClubHead = () => (
    <Head>
        <title>Krak | Club</title>
        <meta
            name="description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more."
        />
        <meta property="og:title" content="Krak Skateboarding Club" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/club" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-club.jpg" />
        <meta
            property="og:description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more"
        />
    </Head>
);

const Club: React.SFC<{}> = () => (
    <TrackedPage name="Club">
        <Layout head={<ClubHead />}>
            <ClubPresentation />
        </Layout>
    </TrackedPage>
);

export default Club;
