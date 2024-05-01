import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

import Layout from '@/components/Layout';
import LayoutFeed from '@/components/Ui/Feed/LayoutFeed';
import RefreshScrollOnNewPage from '@/components/Ui/Utils/RefreshScrollOnNewPage';

import Feed from '@/components/pages/mag/Feed';
import Sidebar from '@/components/pages/mag/Sidebar';
import { wrapper } from '@/store';
import { getPostBySlug, getPostSlugs } from '@/lib/mag/generate';
import { setArticles } from '@/store/mag/slice';

const MagHead = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;
    return (
        <Head>
            <title>Krak Mag | our very own skate stories, interviews, reviews and cie.</title>
            <meta
                name="description"
                content="We are so lucky to be passionate about skateboarding and have the chance to meet so many inspiring people in the skarteboarding world - here are their stories"
            />
            <meta property="og:title" content="Krak Mag | our very own skate stories, interviews, reviews and cie." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/mag`} />
            <meta property="og:image" content={`${baseURL}/images/og-mag.jpg`} />
            <meta
                property="og:description"
                content="We are so lucky to be passionate about skateboarding and have the chance to meet so many inspiring people in the skarteboarding world - here are their stories"
            />
        </Head>
    );
};

const Mag: NextPage = () => {
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    const setSidebarOpeness = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    return (
        <RefreshScrollOnNewPage>
            <Layout head={<MagHead />}>
                <div id="mag-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Feed sidebarNavIsOpen={sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar handleOpenSidebarNav={setSidebarOpeness} sidebarNavIsOpen={sidebarNavIsOpen} />
                        }
                    />
                </div>
            </Layout>
        </RefreshScrollOnNewPage>
    );
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
    const slugs = getPostSlugs();
    const posts = slugs.map((slug) => getPostBySlug(slug));
    console.log(`got ${posts.length} posts`);

    store.dispatch(
        setArticles(
            posts.map((post) => ({
                categories: post.categories,
                featuredImages: post.featuredImages,
                id: post.id,
                slug: post.slug,
                title: post.title,
            })),
        ),
    );
    return {
        props: {},
    };
});

export default Mag;
