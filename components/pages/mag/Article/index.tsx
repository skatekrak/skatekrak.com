import Link from 'next/link';
import React from 'react';

import createMarkup from 'lib/createMarkup';
import decodeHTML from 'lib/decodeHTML';
import createPropsGetter from 'lib/getProps';

import { KrakLoading } from 'components/Ui/Icons/Spinners';
import SocialShare from 'components/Ui/share/SocialShare';
import { Post } from 'wordpress-types';

type Props = {
    post: Post;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    isLoading: false,
};

const getProps = createPropsGetter(defaultProps);

const Article = (rawProps: Props) => {
    const { post, isLoading } = getProps(rawProps);
    if (isLoading) {
        return <KrakLoading />;
    }

    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <article id="mag-article">
            <Link href="/mag">
                <img src="https://res.skatekrak.com/static/krakmag_logo.png" alt="Krak mag" className="krakmag-logo" />
            </Link>
            <div id="mag-article-actions">
                <Link id="mag-article-back" href="/mag">
                    Back to the mag
                </Link>
                <div id="mag-article-share">
                    <span id="mag-article-share-text">Share on:</span>
                    <SocialShare
                        url={`${baseURL}/mag/${post.slug}`}
                        facebookQuote={`${decodeHTML(post.title)} - shared via skatekrak.com`}
                        twitterTitle={decodeHTML(post.title)}
                    />
                </div>
            </div>
            <header id="mag-article-header">
                <p id="mag-article-category">{post.categories.join(', ')}</p>
                <h1 id="mag-article-title" dangerouslySetInnerHTML={createMarkup(post.title)} />
            </header>
            <main id="mag-article-main">
                {post.video ? (
                    <div id="mag-article-video" dangerouslySetInnerHTML={createMarkup(post.video)} />
                ) : (
                    <div id="mag-article-cover-img-container">
                        <div
                            id="mag-article-cover-img"
                            style={{ backgroundImage: `url("${post.featuredImages[0].source_url}")` }}
                        />
                    </div>
                )}
                <div id="mag-article-content" dangerouslySetInnerHTML={createMarkup(post.content)} />
            </main>
        </article>
    );
};

export default Article;
