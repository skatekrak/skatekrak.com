import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import Truncate from 'react-truncate';

import createMarkup from 'lib/createMarkup';
import { Post } from 'wordpress-types';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import useRelatedPosts from 'lib/hook/mag/related-posts';

type RelatedPostsProps = {
    post: Post;
};

const RelatedPosts = ({ post }: RelatedPostsProps) => {
    const { isLoading, data: relatedPosts } = useRelatedPosts(post);

    return (
        <div className="mag-sidebar-posts">
            <h3 className="mag-sidebar-posts-title">Related articles</h3>
            {isLoading && <SpinnerCircle />}
            {!isLoading && relatedPosts != null && relatedPosts.length === 0 && <div>No related articles</div>}
            {relatedPosts != null && relatedPosts.length !== 0 && (
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
};

export default React.memo(RelatedPosts);
