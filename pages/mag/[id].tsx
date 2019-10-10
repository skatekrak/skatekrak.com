import axios from 'axios';
import Head from 'next/head';
import { Router, withRouter } from 'next/router';
import React from 'react';

import decodeHTML from 'lib/decodeHTML';

import Layout from 'components/Layout/Layout';
import Sidebar from 'components/pages/mag/Sidebar';
import BannerTop from 'components/Ui/Banners/BannerTop';
import LayoutFeed from 'components/Ui/Feed/LayoutFeed';

import { Post } from 'components/pages/mag/Feed';
import Article from 'components/pages/mag/Feed/Article';

type HeadProps = {
    post: Post;
    isLoading: boolean;
};

const MagArticleHead = ({ post, isLoading }: HeadProps) => (
    <Head>
        {/* {!isLoading && post !== undefined && (
            <>
                <title>Krak Mag. | skateboarding</title>
                <meta name="description" content={decodeHTML(post.excerpt.rendered)} />
                <meta property="og:title" content={decodeHTML(post.title.rendered)} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://skatekrak.com/mag" />
                <meta property="og:image" content={post.thumbnailImage} />
                <meta property="og:description" content={decodeHTML(post.excerpt.rendered)} />
            </>
        )} */}
    </Head>
);

type Props = {
    router: Router;
};

type State = {
    post?: Post;
    isLoading: boolean;
    sidebarNavIsOpen: boolean;
};

class ArticlePage extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
        sidebarNavIsOpen: false,
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });
        const { id } = this.props.router.query;

        try {
            const res = await axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/posts?slug=${id}&_embed`);

            if (res.data) {
                const formatedPost = this.getFormatedPost(res.data[0]);
                this.setState({ post: formatedPost });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { post, isLoading, sidebarNavIsOpen } = this.state;

        return (
            <Layout head={<MagArticleHead isLoading={isLoading} post={post} />}>
                <BannerTop />
                <div id="mag-container" className="inner-page-container">
                    <LayoutFeed
                        mainView={<Article post={post} isLoading={isLoading} sidebarNavIsOpen={sidebarNavIsOpen} />}
                        sidebar={
                            <Sidebar
                                post={post}
                                handleOpenSidebarNav={this.handleOpenSidebarNav}
                                sidebarNavIsOpen={sidebarNavIsOpen}
                            />
                        }
                    />
                </div>
            </Layout>
        );
    }

    private handleOpenSidebarNav = () => {
        const { sidebarNavIsOpen } = this.state;
        this.setState({ sidebarNavIsOpen: !sidebarNavIsOpen });
    };

    private getFormatedPost = (post: Post) => {
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
}

export default withRouter(ArticlePage);
