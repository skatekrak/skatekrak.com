import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

import decodeHTML from 'lib/decodeHTML';

import Layout from 'components/Layout';

import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Article from 'components/pages/mag/Article';
import Sidebar from 'components/pages/mag/Sidebar';
import TrackedPage from 'components/pages/TrackedPage';

import { formatPost } from 'lib/mag/formattedPost';
import { Post } from 'wordpress-types';
import krakmag from 'lib/clients/krakmag';
import { useRouter } from 'next/router';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

type HeadProps = {
    post: Post;
};

const MagArticleHead = ({ post }: HeadProps) => {
    const title = decodeHTML(post.title.rendered);
    const description = decodeHTML(post.excerpt.rendered);

    return (
        <Head>
            <title>Krak Mag. | {title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/mag/${post.slug!}`} />
            <meta property="og:image" content={post.featuredImageFull} />
            <meta property="og:description" content={description.substring(0, 300)} />

            <meta property="og:article:publish_time" content={post.date_gmt} />
            <meta property="og:article:modified_time" content={post.modified_gmt} />
        </Head>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await krakmag.get<Post[]>('/wp-json/wp/v2/posts', {
        params: {
            per_page: 40,
            page: 1,
        },
    });

    return {
        paths: data.map((post) => `/mag/${post.slug}`),
        fallback: true,
    };
};

type MagPostStaticProps = {
    post: Post;
};

export const getStaticProps: GetStaticProps<MagPostStaticProps> = async ({ params }) => {
    const { data } = await krakmag.get<Post>(`/wp-json/wp/v2/posts`, {
        params: {
            slug: params.slug,
            _embed: 1,
        },
    });

    return {
        props: {
            post: formatPost(data[0]),
        },
        revalidate: 3600,
    };
};

type Props = {
    post?: Post;
};

const ArticlePage: NextPage<Props> = ({ post }) => {
    const router = useRouter();
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    const handleOpenSidebarNav = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    if (router.isFallback) {
        return <KrakLoading />;
    }

    return (
        <TrackedPage name={`Mag/${post.slug!}`}>
            <Layout head={<MagArticleHead post={post} />}>
                <div id="mag-article-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Article post={post} sidebarNavIsOpen={sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar
                                post={post}
                                handleOpenSidebarNav={handleOpenSidebarNav}
                                sidebarNavIsOpen={sidebarNavIsOpen}
                            />
                        }
                    />
                </div>
            </Layout>
        </TrackedPage>
    );
};

export default ArticlePage;
