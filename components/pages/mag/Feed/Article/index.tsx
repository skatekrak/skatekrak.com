import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import Link from 'components/Link';
import createMarkup from 'lib/createMarkup';
import decodeHTML from 'lib/decodeHTML';

import { Post } from 'components/pages/mag/Feed';
import Comment from 'components/pages/mag/Feed/Article/Comment';
import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

type Props = {
    post: Post;
    isLoading: boolean;
    sidebarNavIsOpen: boolean;
};

class Article extends React.PureComponent<Props> {
    public render() {
        const { post, isLoading, sidebarNavIsOpen } = this.props;

        return (
            <>
                {isLoading && <KrakLoading />}
                {post && (
                    <article id="mag-article" className={classNames({ hide: sidebarNavIsOpen })}>
                        <div id="mag-article-actions">
                            <Link href="/mag">
                                <a id="mag-article-back">Back to the mag</a>
                            </Link>
                            <div id="mag-article-share">
                                <span id="mag-article-share-text">Share on:</span>
                                <FacebookShareButton
                                    url={`https://skatekrak.com/mag/${post.slug}`}
                                    quote={`${decodeHTML(post.title.rendered)} - shared via skatekrak.com`}
                                >
                                    <FacebookIcon size={24} round />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={`https://skatekrak.com/mag/${post.slug}`}
                                    title={decodeHTML(post.title.rendered)}
                                    via="skatekrak"
                                >
                                    <TwitterIcon size={24} round />
                                </TwitterShareButton>
                                <ClipboardButton value={`https://skatekrak.com/mag/${post.slug}`} />
                            </div>
                        </div>
                        <header id="mag-article-header">
                            <p id="mag-article-category">{post.categoriesString}</p>
                            <h1 id="mag-article-title" dangerouslySetInnerHTML={createMarkup(post.title.rendered)} />
                            <p id="mag-article-date">
                                {format(post.date, 'MMMM D')}, {format(post.date, 'YYYY')}
                            </p>
                        </header>
                        <main id="mag-article-main">
                            {post._format_video_embed ? (
                                <div
                                    id="mag-article-video"
                                    dangerouslySetInnerHTML={createMarkup(post._format_video_embed)}
                                />
                            ) : (
                                <div id="mag-article-cover-img-container">
                                    <div
                                        id="mag-article-cover-img"
                                        style={{ backgroundImage: `url("${post.featuredImageFull}")` }}
                                    />
                                </div>
                            )}
                            <div
                                id="mag-article-content"
                                dangerouslySetInnerHTML={createMarkup(post.content.rendered)}
                            />
                            <Comment />
                        </main>
                    </article>
                )}
            </>
        );
    }
}

export default Article;
