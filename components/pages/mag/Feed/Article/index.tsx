import axios from 'axios';
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
    id: string;
};

type State = {
    post?: Post;
    isLoading: boolean;
};

class Article extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });

        try {
            const res = await axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/posts/${this.props.id}?_embed`);

            if (res.data) {
                const formatedPost = await this.getFormatedPost(res.data);
                this.setState({ post: formatedPost });
            }
        } catch (err) {
            console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { post, isLoading } = this.state;

        return (
            <>
                {isLoading && <KrakLoading />}
                {post && (
                    <article id="mag-article">
                        {console.log(`https://skatekrak.com/mag/${post.slug}`)}
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

    private getFormatedPost = async (post: Post) => {
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
            const featuredImageFull = post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
            post.featuredImageFull = featuredImageFull;
        }

        return post;
    };
}

export default Article;
