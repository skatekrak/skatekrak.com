import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

import decodeHTML from 'lib/decodeHTML';

import Layout from 'components/Layout/Layout';

import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import Article from 'components/pages/mag/Article';
import { Post } from 'components/pages/mag/Feed';
import Sidebar from 'components/pages/mag/Sidebar';
import TrackedPage from 'components/pages/TrackedPage';

import { formatPost } from 'lib/mag/formattedPost';

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
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_NEXT_PUBLIC_WEBSITE_URL}/mag/${post.slug!}`} />
            <meta property="og:image" content={post.featuredImageFull} />
            <meta property="og:description" content={description.substring(0, 300)} />

            <meta property="og:article:publish_time" content={post.date_gmt} />
            <meta property="og:article:modified_time" content={post.modified_gmt} />
        </Head>
    );
};

type Props = {
    post?: Post;
};

const ArticlePage: NextPage<Props> = ({ post }) => {
    const [sidebarNavIsOpen, setSidebarNavOpen] = useState(false);

    const handleOpenSidebarNav = () => {
        setSidebarNavOpen(!sidebarNavIsOpen);
    };

    return (
        <TrackedPage name={`Mag/${post.slug!}`}>
            <Layout head={<MagArticleHead post={post} />}>
                <BannerTop offsetScroll link="/" text="Become a co-owner" />
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

ArticlePage.getInitialProps = async ({ query }) => {
    const { slug } = query;

    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
        );
        if (res.data) {
            const formattedPost = formatPost(res.data[0]);
            return { post: formattedPost };
        }
        return {};
    } catch (err) {
        return {};
    }
};

export default ArticlePage;
