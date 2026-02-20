import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import LayoutFeed from '@/components/Ui/Feed/LayoutFeed';
import RefreshScrollOnNewPage from '@/components/Ui/Utils/RefreshScrollOnNewPage';

import Feed from '@/components/pages/mag/Feed';
import Sidebar from '@/components/pages/mag/Sidebar';
import { getPostBySlug, getPostSlugs } from '@/lib/mag/generate';
import { SlicePost, useMagStore } from '@/store/mag';

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

const Mag: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ articles }) => {
    const setArticles = useMagStore((state) => state.setArticles);
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    useEffect(() => {
        setArticles(articles);
    }, [articles, setArticles]);

    const setSidebarOpeness = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    return (
        <RefreshScrollOnNewPage>
            <Layout head={<MagHead />}>
                <div id="mag-container" className="w-full pt-8 pb-8 laptop-s:pt-16">
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

export const getStaticProps: GetStaticProps<{ articles: SlicePost[] }> = () => {
    const slugs = getPostSlugs();
    const posts = slugs.map((slug) => getPostBySlug(slug));
    console.log(`got ${posts.length} posts`);

    return {
        props: {
            articles: posts.map((post) => ({
                categories: post.categories,
                featuredImages: post.featuredImages,
                id: post.id,
                slug: post.slug,
                title: post.title,
            })),
        },
    };
};

export default Mag;
