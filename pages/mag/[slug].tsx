import axios from 'axios';
import { NextPageContext } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';

import decodeHTML from 'lib/decodeHTML';

import Layout from 'components/Layout/Layout';
import Sidebar from 'components/pages/mag/Sidebar';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import { Post } from 'components/pages/mag/Feed';
import Article from 'components/pages/mag/Feed/Article';
import TrackedPage from 'components/pages/TrackedPage';

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
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${getConfig().publicRuntimeConfig.WEBSITE_URL}/mag`} />
            <meta property="og:image" content={post.thumbnailImage} />
            <meta property="og:description" content={description} />
        </Head>
    );
};

type Props = {
    post?: Post;
};

type State = {
    sidebarNavIsOpen: boolean;
};

class ArticlePage extends React.Component<Props, State> {
    public static async getInitialProps({ query }: NextPageContext) {
        try {
            const { slug } = query;
            const res = await axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
            if (res.data) {
                const formattedPost = ArticlePage.getFormattedPost(res.data[0]);
                return { post: formattedPost };
            }
            return {};
        } catch (err) {
            return {};
        }
    }

    private static getFormattedPost = (post: Post): Post => {
        // Get formated categories
        if (post.categories) {
            const categories = post._embedded['wp:term'][0];
            let formatedCategories = '';
            for (let iCategory = 0; iCategory < categories.length; iCategory++) {
                const categoryName = categories[iCategory].name;
                formatedCategories += categoryName;
                if (iCategory !== categories.length - 1) {
                    formatedCategories += ', ';
                }
            }
            post.categoriesString = formatedCategories;
        }

        // Get image
        if (post.featured_media) {
            const thumbnailImage = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
            post.thumbnailImage = thumbnailImage;

            const featuredImageFull = post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
            post.featuredImageFull = featuredImageFull;
        }

        return post;
    };

    public state: State = {
        sidebarNavIsOpen: false,
    };

    public render() {
        const { sidebarNavIsOpen } = this.state;
        const { post } = this.props;

        return (
            <TrackedPage name={`Mag/${post.slug!}`}>
                <Layout head={<MagArticleHead post={post} />}>
                    <BannerTop />
                    <div id="mag-container" className="inner-page-container">
                        <div id="mag-article-container">
                            <LayoutFeed
                                mainView={<Article post={post} sidebarNavIsOpen={sidebarNavIsOpen} />}
                                sidebar={
                                    <Sidebar
                                        post={post}
                                        handleOpenSidebarNav={this.handleOpenSidebarNav}
                                        sidebarNavIsOpen={sidebarNavIsOpen}
                                    />
                                }
                            />
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private handleOpenSidebarNav = () => {
        const { sidebarNavIsOpen } = this.state;
        this.setState({ sidebarNavIsOpen: !sidebarNavIsOpen });
    };
}

export default ArticlePage;
