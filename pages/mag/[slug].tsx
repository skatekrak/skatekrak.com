import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import decodeHTML from 'lib/decodeHTML';

import Layout from 'components/Layout';

import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Article from 'components/pages/mag/Article';

import { Post } from 'wordpress-types';
import { getPostBySlug, getPostSlugs } from 'lib/mag/generate';

type HeadProps = {
    post: Post;
};

const MagArticleHead = ({ post }: HeadProps) => {
    const title = decodeHTML(post.title);
    const description = decodeHTML(post.content.substring(0, 200));

    return (
        <Head>
            <title>Krak Mag. | {title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/mag/${post.slug!}`} />
            <meta property="og:image" content={post.featuredImages[0].source_url} />
            <meta property="og:description" content={description.substring(0, 300)} />

            <meta property="og:article:publish_time" content={post.date_gmt} />
        </Head>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = getPostSlugs();

    return {
        paths: slugs.map((slug: string) => ({
            params: {
                slug,
            },
        })),
        fallback: false,
    };
};

type MagPostStaticProps = {
    post: Post;
};

export const getStaticProps: GetStaticProps<MagPostStaticProps> = async ({ params }) => {
    const post: any = getPostBySlug(params.slug as string);

    return {
        props: {
            post,
        },
    };
};

type Props = {
    post?: Post;
};

const ArticlePage: NextPage<Props> = ({ post }) => {
    return (
        <Layout head={<MagArticleHead post={post} />}>
            <div id="mag-article-container" className="inner-page-container">
                <LayoutFeed mainView={<Article post={post} />} />
            </div>
        </Layout>
    );
};

export default ArticlePage;
