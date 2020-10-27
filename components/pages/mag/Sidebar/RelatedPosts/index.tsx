import axios from 'axios';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import Truncate from 'react-truncate';

import createMarkup from 'lib/createMarkup';
import { formatPost } from 'lib/mag/formattedPost';

import { Post } from 'components/pages/mag/Feed';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    post: Post;
};

type State = {
    isLoading: boolean;
    relatedPosts?: any[];
};

class RelatedPosts extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
        relatedPosts: [],
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });
        const { post } = this.props;

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts`, {
                params: { per_page: 3, categories: post.categories[0], before: post.date, _embed: 1 },
            });

            if (res.data && res.data.length !== 0) {
                const relatedPosts = res.data.map((relatedPost) => formatPost(relatedPost));
                this.setState({ relatedPosts });
            } else {
                const res2 = await axios.get(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts`, {
                    params: { per_page: 3, categories: post.categories[0], _embed: 1 },
                });

                if (res2.data && res.data.length !== 0) {
                    const relatedPosts = res.data.map((relatedPost) => formatPost(relatedPost));
                    this.setState({ relatedPosts });
                }
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { isLoading, relatedPosts } = this.state;

        return (
            <div className="mag-sidebar-posts">
                <h3 className="mag-sidebar-posts-title">Related articles</h3>
                {isLoading && <SpinnerCircle />}
                {!isLoading && relatedPosts.length === 0 && <div>No related articles</div>}
                {relatedPosts && relatedPosts.length !== 0 && (
                    <ul className="mag-sidebar-posts-list">
                        {relatedPosts.map((post) => (
                            <li key={post.id} className="mag-sidebar-posts-item">
                                <Link href={`/mag/${post.slug}`}>
                                    <a>
                                        <div className="mag-sidebar-posts-item-img-box-container">
                                            <div className="mag-sidebar-posts-item-img-container">
                                                <div
                                                    className="mag-sidebar-posts-item-img"
                                                    style={{
                                                        backgroundImage: `url("${post.thumbnailImage}")`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mag-sidebar-posts-item-details">
                                            <h4 className="mag-sidebar-posts-item-details-title">
                                                <Truncate lines={2} ellipsis="..." trimWhitespace>
                                                    <span dangerouslySetInnerHTML={createMarkup(post.title.rendered)} />
                                                </Truncate>
                                            </h4>
                                            <p className="mag-sidebar-posts-item-details-date">
                                                {format(parseISO(post.date), 'MMMM d')},{' '}
                                                {format(parseISO(post.date), 'yyyy')}
                                            </p>
                                        </div>
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default RelatedPosts;
